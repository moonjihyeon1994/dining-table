from parse import load_dataframes
import pandas as pd
import shutil
import surprise
from surprise.model_selection import cross_validate
import matplotlib.pyplot as plt

from collections import defaultdict

from surprise import SVD
from surprise import Dataset


def sort_stores_by_score(dataframes, n=20, min_reviews=30):
    """
    Req. 1-2-1 각 음식점의 평균 평점을 계산하여 높은 평점의 음식점 순으로 `n`개의 음식점을 정렬하여 리턴합니다
    Req. 1-2-2 리뷰 개수가 `min_reviews` 미만인 음식점은 제외합니다.
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    print(type(scores_group))
    scores_group = scores_group.filter(lambda d: len(d) > min_reviews)
    print(type(scores_group))
    # scores_group = scores_group.filter(lambda d: d["user"].count() > min_reviews)

    scores_group = scores_group.groupby(["store", "store_name"])
    scores = scores_group.mean()
    scores = scores.sort_values(by=['score'], ascending=[False])
    return scores.head(n=n).reset_index()


def get_most_reviewed_stores(dataframes, n=20):
    """
    Req. 1-2-3 가장 많은 리뷰를 받은 `n`개의 음식점을 정렬하여 리턴합니다
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    scores = scores_group.count()
    scores = scores.sort_values(by=['score'], ascending=[False])
    return scores.head(n=n).reset_index()


def get_most_active_users(dataframes, n=20):
    """
    Req. 1-2-4 가장 많은 리뷰를 작성한 `n`명의 유저를 정렬하여 리턴합니다.
    """
    stores_reviews = dataframes["users"]
    scores_group = stores_reviews.groupby(["id"])
    scores = scores_group.count()
    scores = scores.sort_values(by=['gender'], ascending=[False])
    return scores.head(n=n).reset_index()


def test(dataframes):
    print("시작")
    reviews = pd.DataFrame(data=dataframes["reviews"], columns=["user", "store", "score"])
    least_2more_reviews = reviews.groupby(["user"])
    least_2more_reviews = least_2more_reviews.filter(lambda d: len(d) > 4)

    #dataframe -> dictionary
    df_to_dict = recur_dictify(least_2more_reviews)
    # print(df_to_dict)

    user_list = []  #중복 불가능
    store_set = set()  #중복 가능

    for user_key in df_to_dict:
        user_list.append(user_key)

        for store_key in df_to_dict[user_key] :
            store_set.add(store_key)

    store_list = list(store_set)

    rating_dic = {
        'user_id' : [],
        'store_id' : [],
        'rating' : []
    }

    for id_key in df_to_dict :
        for store_key in df_to_dict[id_key] :

            id_idx = user_list.index(id_key)
            store_idx = store_list.index(store_key)
            rating = df_to_dict[id_key][store_key]

            rating_dic['user_id'].append(id_idx)
            rating_dic['store_id'].append(store_idx)
            rating_dic['rating'].append(rating)
    print(len(rating_dic['user_id']))
    print(len(rating_dic['store_id']))
    print(len(rating_dic['rating']))

    df = pd.DataFrame(rating_dic)
    print(df)

    reader = surprise.Reader(rating_scale = (1, 5))
    
    col_list = ['user_id', 'store_id', 'rating']
    data = surprise.Dataset.load_from_df(df[col_list], reader)
    print(col_list)

    trainset = data.build_full_trainset()
    option = {'name':'pearson'}
    algo = surprise.KNNBasic(sim_options=option)
    algo.fit(trainset)

    # who = input('id 입력')
    # print('\n')

    # index = user_list.index(350771)
    # print('user_index: ',index)
    # print('\n')

    result = algo.get_neighbors(134, k=5)
    print('유사한 유저는 : ', result)
    print('\n')
    print('추천은?')

    for r in result :
        max_rating = data.df[data.df["user_id"]==r]["rating"].max()
        store_id = data.df[(data.df["rating"]==max_rating)&(data.df["user_id"]==r)]["store_id"].values

        for store_item in store_id :
            print(store_list[store_item])


def recur_dictify(dataframe):
    if len(dataframe.columns) == 1:
        if dataframe.values.size == 1:
            return dataframe.values[0][0]
        return dataframe.values.squeeze()
    grouped = dataframe.groupby(dataframe.columns[0])
    d = {k: recur_dictify(g.ix[:, 1:]) for k,g in grouped}
    return d


def test_1(dataframes):
    print("시작")
    reviews = pd.DataFrame(data=dataframes["reviews"], columns=["user", "store", "score"])

    reader = surprise.Reader(rating_scale = (1,5))
    col_list = ["user", "store", "score"]
    data = surprise.Dataset.load_from_df(reviews[col_list], reader)
    
    benchmark = []
    # surprise.NMF(), 
    for algorithm in [surprise.NormalPredictor(), surprise.BaselineOnly(), surprise.KNNBasic(), surprise.KNNWithMeans(), surprise.KNNWithZScore(), surprise.KNNBaseline(), surprise.SVD(), surprise.SVDpp(), surprise.SlopeOne(), surprise.CoClustering()]:
        results = cross_validate(algorithm, data, measures=['RMSE'], cv=3, verbose=False)

        tmp = pd.DataFrame.from_dict(results).mean(axis=0)
        # print(str(algorithm))
        tmp = tmp.append(pd.Series([str(algorithm).split(' ')[0].split('.')[-1]], index=['Algorithm']))
        # print(tmp)
        
        benchmark.append(tmp)

    result_algorithms = pd.DataFrame(benchmark).set_index('Algorithm').sort_values('test_rmse')
    print(result_algorithms)


def test_2(dataframes):

    reviews = pd.DataFrame(data=dataframes["reviews"], columns=["user", "store", "score"])

    reader = surprise.Reader(rating_scale = (1,5))
    col_list = ["user", "store", "score"]
    data = surprise.Dataset.load_from_df(reviews[col_list], reader)

    # First train an SVD algorithm on the movielens dataset.
    # data = Dataset.load_builtin('ml-100k')
    print(data)
    trainset = data.build_full_trainset()
    algo = SVD()
    algo.fit(trainset)

    # Than predict ratings for all pairs (u, i) that are NOT in the training set.
    testset = trainset.build_anti_testset()
    predictions = algo.test(testset)

    top_n = get_top_n(predictions, n=10)

    # Print the recommended items for each user
    for uid, user_ratings in top_n.items():
        print(uid, [iid for (iid, _) in user_ratings])


def get_top_n(predictions, n=10):
    # First map the predictions to each user.
    top_n = defaultdict(list)
    for uid, iid, true_r, est, _ in predictions:
        top_n[uid].append((iid, est))

    # Then sort the predictions for each user and retrieve the k highest ones.
    for uid, user_ratings in top_n.items():
        user_ratings.sort(key=lambda x: x[1], reverse=True)
        top_n[uid] = user_ratings[:n]

    return top_n


def main():
    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    test(data)
    # test_1(data)
    # test_2(data)

    # stores_most_scored = sort_stores_by_score(data)

    # print("[최고 평점 음식점]")
    # print(f"{separater}\n")
    # for i, store in stores_most_scored.iterrows():
    #     print(
    #         "{rank}위: {store}({score}점)".format(
    #             rank=i + 1, store=store.store_name, score=store.score
    #         )
    #     )
    # print(f"\n{separater}\n\n")

    # most_reviewed_stores = get_most_reviewed_stores(data)
    # print("[최다 리뷰 음식점]")
    # print(f"{separater}\n")
    # for i, store in most_reviewed_stores.iterrows():
    #     # print(store)
    #     print(
    #         "{rank}위: {store}({score}개)".format(
    #             rank=i + 1, store=store.store_name, score=store.score
    #         )
    #     )
    # print(f"\n{separater}\n\n")
    #
    # most_active_users = get_most_active_users(data)
    # print("[최다 리뷰 작성 유저]")
    # print(f"{separater}\n")
    # for i, store in most_active_users.iterrows():
    #     print(
    #         "{rank}위: id {id}({score}개)".format(
    #             rank=i + 1, id=store.id, score=store.gender
    #         )
    #     )
    # print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
