# from pathlib import Path
# import sqlite3
import pandas as pd
from api import models
# import surprise
# from surprise.model_selection import cross_validate
# import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD

# from collections import defaultdict

# from surprise import SVD
# from surprise import Dataset

import numpy as np
from scipy.sparse.linalg import svds 

import json


def knn_userbase():
    reviews = pd.DataFrame(list(models.Review.objects.all().values('user', 'store', 'score')))
    stores = pd.DataFrame(list(models.Store.objects.all().values('id', 'store_name', 'category')))
    stores.columns = ['store', 'store_name', 'category']

    least_2more_reviews = reviews.groupby(["user"])
    least_2more_reviews = least_2more_reviews.filter(lambda d: len(d) > 10)

    user_store_rating = pd.merge(least_2more_reviews, stores, on='store')

    print(least_2more_reviews)
    print(stores)
    print(user_store_rating)

    store_user_rating = user_store_rating.pivot_table('score', index="store_name", columns="user")
    # user_store_rating = user_store_rating.pivot_table('score', index="user", columns="store")

    store_user_rating.fillna(0, inplace = True)
    # user_store_rating.fillna(0, inplace = True)

    print(store_user_rating.head(10))
    # print(user_store_rating.head(10))

    item_based_collabor = cosine_similarity(store_user_rating)
    item_based_collabor = pd.DataFrame(data=item_based_collabor, index=store_user_rating.index, columns=store_user_rating.index)
    print(item_based_collabor)

    result = item_based_collabor['깐부치킨'].sort_values(ascending=False)[:50]
    print(result)

def svd(store_id):
    store = models.Store.objects.get(id=store_id)
    selected_store_list = list(models.Store.objects.filter(area__contains=store.area).values_list('id', flat=True))
    selected_store_list.append(models.Store.objects.get(id=store_id).id)

    store_list = list()
    review_list = list()
    for store_id in selected_store_list:
        for i in list(models.Store.objects.filter(id=store_id).values('id', 'store_name', 'category')):
            store_list.append(i)
        for i in list(models.Review.objects.filter(store_id=store_id).values('user_id', 'store_id', 'score')):
            review_list.append(i)

    stores = pd.DataFrame(store_list)
    reviews = pd.DataFrame(review_list)
    # reviews = pd.DataFrame(list(models.Review.objects.filter(store_id__in=selected_store_list).values('user_id', 'store_id', 'score')))
    # stores = pd.DataFrame(list(models.Store.objects.filter(id__in=selected_store_list).values('id', 'store_name', 'category')))
    
    stores.columns = ['store_id', 'store_name', 'category']

    user_store_data = pd.merge(reviews, stores, on='store_id')

    user_store_rating = user_store_data.pivot_table('score', index="user_id", columns="store_name").fillna(0)

    store_user_rating = user_store_rating.values.T

    SVD = TruncatedSVD(n_components=10)
    matrix = SVD.fit_transform(store_user_rating)

    corr = np.corrcoef(matrix)

    store_name = user_store_rating.columns
    store_name_list = list(store_name)

    name = store_name_list.index(store.store_name)

    corr_name = corr[name]
    result = list(store_name[(corr_name >= -1)])[:7]
    return(result)

def recommend_stores(df_svd_preds, user_id, ori_stores_df, ori_ratings_df, num_recommendations=5):
    user_row_number = user_id - 1
    sorted_user_predictions = df_svd_preds.iloc[user_row_number].sort_values(ascending=False)
    user_data = ori_ratings_df[ori_ratings_df.user_id == user_id]

    ori_stores_df.rename(columns = {'id' : 'store'}, inplace=True)
    user_history = user_data.merge(ori_stores_df, on='store').sort_values(['score'], ascending=False)

    recommendations = ori_stores_df[~ori_stores_df['store'].isin(user_history['store'])]

    recommendations = recommendations.merge(pd.DataFrame(sorted_user_predictions).reset_index(), on = 'store')

    recommendations = recommendations.rename(columns = {user_row_number: 'Predictions'}).sort_values('Predictions', ascending=False)

    return user_history, recommendations

def recommend(selected_store_list, user_id=1):
    # reviews = pd.DataFrame(list(models.Review.objects.filter(store_id__in=selected_store_list).values('user', 'store_id', 'score')))
    # stores = pd.DataFrame(list(models.Store.objects.filter(id__in=selected_store_list).values('id', 'store_name', 'classification')))
    store_list = list()
    review_list = list()
    for store_id in selected_store_list:
        for i in list(models.Store.objects.filter(id=store_id).values('id', 'store_name', 'classification')):
            store_list.append(i)
        for i in list(models.Review.objects.filter(store_id=store_id).values('user_id', 'store_id', 'score')):
            review_list.append(i)

    stores = pd.DataFrame(store_list)
    reviews = pd.DataFrame(review_list)

    # reviews = pd.DataFrame(list(models.Review.objects.all().values('user', 'store_id', 'score')))
    # stores = pd.DataFrame(list(models.Store.objects.all().values('id', 'store_name', 'classification')))
    stores.columns = ['id', 'store_name', 'classification']
    reviews.rename(columns = {'store_id' : 'store'}, inplace=True)
    # least_2more_reviews = reviews.groupby(["user"])
    # least_2more_reviews = least_2more_reviews.filter(lambda d: len(d) > 5)

    df_user_store_ratings = reviews.pivot(
        index='user_id',
        columns='store',
        values='score'
    ).fillna(0)

    matrix = df_user_store_ratings.as_matrix()

    user_ratings_mean = np.mean(matrix, axis =1)

    matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1)

    # d = pd.DataFrame(matrix_user_mean, columns = df_user_store_ratings.columns).head()
    # print(d)

    # print(matrix_user_mean.shape[0])

    U, sigma, Vt = svds(matrix_user_mean, k = 3)

    sigma = np.diag(sigma)

    svd_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
    df_svd_preds = pd.DataFrame(svd_user_predicted_ratings, columns=df_user_store_ratings.columns)
    # print(df_svd_preds.head())

    already_rated, predictions = recommend_stores(df_svd_preds, user_id, stores, reviews, 8)
    # print('----그전의 기록----')
    # print(already_rated.head(8))
    # print('-----추측---------')
    # print(predictions)

    # print(predictions['store'].values.tolist())
    # print(json.dumps([predictions.columns.values.tolist()] + predictions.values.tolist(), indent=4, ensure_ascii=False))
    # return predictions.to_json(orient='index', force_ascii=False)
    return predictions['store'].values.tolist()
