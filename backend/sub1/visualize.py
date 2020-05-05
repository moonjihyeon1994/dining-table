import itertools
from collections import Counter
from parse import load_dataframes
from analyze import get_most_active_users, get_most_reviewed_stores, sort_stores_by_score
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import folium
from folium.plugins import MarkerCluster


def set_config():
    # 폰트, 그래프 색상 설정
    font_list = fm.findSystemFonts(fontpaths=None, fontext="ttf")
    if any(["notosanscjk" in font.lower() for font in font_list]):
        plt.rcParams["font.family"] = "Noto Sans CJK JP"
    else:
        if not any(["malgun" in font.lower() for font in font_list]):
            raise Exception(
                "Font missing, please install Noto Sans CJK or Malgun Gothic. If you're using ubuntu, try `sudo apt install fonts-noto-cjk`"
            )

        plt.rcParams["font.family"] = "Malgun Gothic"

    sns.set_palette(sns.color_palette("Spectral"))
    plt.rc("xtick", labelsize=6)


def show_store_categories_graph(dataframes, n=100):
    """
    Tutorial: 전체 음식점의 상위 `n`개 카테고리 분포를 그래프로 나타냅니다.
    """
    stores = dataframes["stores"]

    # 모든 카테고리를 1차원 리스트에 저장합니다
    categories = stores.category.apply(lambda c: c.split("|"))
    categories = itertools.chain.from_iterable(categories)
    # 카테고리가 없는 경우 / 상위 카테고리를 추출합니다
    categories = filter(lambda c: c != "", categories)
    categories_count = Counter(list(categories))
    print(categories_count)
    best_categories = categories_count.most_common(n=n)
    print(best_categories)
    df = pd.DataFrame(best_categories, columns=["category", "count"]).sort_values(
        by=["count"], ascending=False
    )
    print(df)
    # 그래프로 나타냅니다
    chart = sns.barplot(x="category", y="count", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 카테고리 분포")
    plt.show()


def show_store_review_distribution_graph(dataframes):
    """
    Req. 1-3-1 전체 음식점의 리뷰 개수 분포를 그래프로 나타냅니다. 
    """
    stores_most_scored = get_most_reviewed_stores(dataframes, 100)
    df = pd.DataFrame(data=stores_most_scored, columns=["store_name", "score"])

    chart = sns.barplot(x="store_name", y="score", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("리뷰 개수 분포")
    plt.show()


def show_store_average_ratings_graph(dataframes):
    """
    Req. 1-3-2 각 음식점의 평균 평점을 그래프로 나타냅니다.
    """
    stores_by_score = sort_stores_by_score(dataframes, 100)
    df = pd.DataFrame(data=stores_by_score, columns=["store_name", "score"])

    chart = sns.barplot(x="store_name", y="score", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("각 음식점의 평균 평점")
    plt.show()


def show_user_review_distribution_graph(dataframes):
    """
    Req. 1-3-3 전체 유저의 리뷰 개수 분포를 그래프로 나타냅니다.
    """
    most_active_users = get_most_active_users(dataframes, 100)
    df = pd.DataFrame(data=most_active_users, columns=["id"])
    df["count"] = most_active_users["gender"]

    ids = df["id"]
    chart = sns.barplot(x="id", y="count", data=df, order=ids)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("유저의 리뷰 개수 분포")
    plt.show()


def show_user_age_gender_distribution_graph(dataframes):
    """
    Req. 1-3-4 전체 유저의 성별/나이대 분포를 그래프로 나타냅니다.
    """
    users = dataframes["users"]

    users_gender_cnt = pd.DataFrame(data=users, columns=["age", "gender"])

    users_gender_cnt["male"] = users_gender_cnt["gender"] == "남"
    users_gender_cnt["female"] = users_gender_cnt["gender"] == "여"
    print(users_gender_cnt)
    gb_user = users_gender_cnt.groupby(["age"]).sum()

    ax = gb_user.plot(kind='barh', stacked=True, title="년도별 남녀 분포", rot=0)
    for p in ax.patches:
        left, bottom, width, height = p.get_bbox().bounds
        ax.annotate("%.1f" % (width), xy=(left + width / 2, bottom + height / 2), ha='center', va='center')
    plt.box(False)
    plt.show()


def show_stores_distribution_graph(dataframes):
    """
    Req. 1-3-5 각 음식점의 위치 분포를 지도에 나타냅니다.
    """
    stores = dataframes["stores"]

    contains = stores["address"].str.contains("강원도", na=False)

    subset = stores[contains]

    center = [37.541, 126.986]
    m = folium.Map(location=center, zoom_start=10)

    marker_cluster = MarkerCluster().add_to(m)
    for i, store in subset.iterrows():
        folium.Marker(
            location=[store.latitude, store.longitude],
            popup=store.store_name,
            icon=folium.Icon(color='red', icon='ok')
        ).add_to(marker_cluster)
        if i == 1000:
            break

    m.save('./map.html')


def main():
    set_config()
    data = load_dataframes()
    # show_store_categories_graph(data)
    # show_store_review_distribution_graph(data)
    # show_store_average_ratings_graph(data)
    # show_user_review_distribution_graph(data)
    # show_user_age_gender_distribution_graph(data)
    # show_stores_distribution_graph(data)


if __name__ == "__main__":
    main()
