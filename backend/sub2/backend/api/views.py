import datetime
from api import models, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
import datetime
from django.shortcuts import get_object_or_404
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser
import requests
import jwt
from rest_framework.decorators import action
from backend import settings
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
import json
import pandas as pd
from .service import algorithm
from rest_framework.decorators import api_view
import math
from django.forms.models import model_to_dict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class SmallPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.StoreSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        name = self.request.query_params.get("name", "")
        queryset = (
            models.Store.objects.all().filter(store_name__contains=name).order_by("id")
        )
        return queryset


class ReviewViewSet(APIView):
    pagination_class = SmallPagination

    parser_class = (FileUploadParser, MultiPartParser, FormParser)

    def get_object(self, pk):
        try:
            review = get_object_or_404(models.Review, pk=pk)
            return review
        except:
            return -1

    def get(self, request, pk):
        review = self.get_object(pk)
        if review != -1:
            serializer = serializers.ReviewSerializer(review)
            review = serializer.data
            review["nickname"] = get_object_or_404(models.User, id=review["user"]).nickname
            return Response(review, status=status.HTTP_200_OK)
        else:
            result = {"result": -1}
            return Response(result, status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        received_data = request.data
        print(received_data)
        review_dict = {
            "id": None,
            "store": received_data.get("store"),
            "user": received_data.get("user"),
            "score": received_data.get("score"),
            "content": received_data.get("content"),
            "reg_time": datetime.datetime.now(),
            "taste": received_data.get("taste"),
            "service": received_data.get("service"),
            "price_satisfaction": received_data.get("price_satisfaction"),
            "interior": received_data.get("interior")
        }

        review_serializer = serializers.ReviewSerializer(data=review_dict)
        if review_serializer.is_valid():
            saved_id = review_serializer.save().id
            files = received_data.getlist("file")
            print(type(files))
            print(files)
            file_size = len(files)
            if file_size > 0:
                for file in files:
                    review_image_dict = {
                        "id": None,
                        'file': file,
                        'review': saved_id
                    }
                    review_image_serializer = serializers.ReviewImageSerializer(data=review_image_dict)
                    if review_image_serializer.is_valid():
                        review_image_serializer.save()
                    else:
                        print(review_image_serializer.error_messages)

                result = {"saved_review_id": saved_id}
                return Response(result, status=status.HTTP_201_CREATED)
            result = {"saved_review_id": saved_id}
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            print("에러나?")
            print(review_serializer.error_messages)
            return Response(review_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        review = self.get_object(pk)
        serializer = serializers.ReviewSerializer(review, data=request.data)
        if review != -1:
            if serializer.is_valid():
                serializer.save()
                print("수정성공")
                result = {'result': True}
                return Response(result, status=status.HTTP_202_ACCEPTED)
            else:
                result = {"result": False}
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
        else:
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = self.get_object(pk)
        if review != -1:
            review.delete()
            result = {"result": True}
            return Response(result, status=status.HTTP_200_OK)
        else:
            result = {"result": False}
            return Response(result, status=status.HTTP_204_NO_CONTENT)


class ReviewViewSetByStoreId(APIView):
    def get(self, request, store_id):
        print("상점 아이디로 찾기")
        reviews = (
            models.Review.objects.filter(store_id=store_id).order_by('id')
        )
        review_list = list(reviews)

        # 전체 리뷰
        all_review_dict_list = []
        for review in review_list:
            review_dict = model_to_dict(review)
            review_dict["nickname"] = get_object_or_404(models.User, id=review_dict["user"]).nickname
            all_review_dict_list.append(review_dict)

        # 각 리뷰에 대해, 좋아요 top3
        review_list.sort(key=lambda review: models.ReviewLike.objects.filter(review=review.id).count(), reverse=True)

        top3_review_dict_list = []
        for i in range(0, len(review_list)):
            if i > 2:
                break
            review_dict = model_to_dict(review_list[i])
            review_dict["nickname"] = get_object_or_404(models.User, id=review_dict["user"]).nickname
            top3_review_dict_list.append(review_dict)

        result = {"all": all_review_dict_list, "top3": top3_review_dict_list}

        return Response(result, status=status.HTTP_201_CREATED)


class ReviewImageViewSet(APIView):
    def get(self, request, review_id):
        review_images = (
            models.ReviewImage.objects.filter(review=review_id).order_by('id')
        )
        serializer = serializers.ReviewImageSerializer(review_images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewLikeCountViewSet(APIView):
    pagination_class = SmallPagination

    def get(self, request, review_id):
        count = models.ReviewLike.objects.filter(review=review_id).count()
        result = {"result": count}
        return Response(result, status=status.HTTP_200_OK)


class ReviewLikeViewSet(APIView):
    pagination_class = SmallPagination

    def get_object(self, user_id, review_id):
        try:
            review_like = get_object_or_404(models.ReviewLike, user=user_id, review=review_id)
            return review_like
        except:
            return -1

    def get(self, request, user_id, review_id):
        review_like = self.get_object(user_id, review_id)
        if review_like != -1:
            result = {"result": True}
            return Response(result, status=status.HTTP_200_OK)
        else:
            result = {"result": False}
            return Response(result, status=status.HTTP_200_OK)

    def decide_grade(self, review_id):
        user = get_object_or_404(models.Review, id=review_id).user
        reviews = (models.Review.objects.filter(user=user.id))

        total_like = 0
        for review in reviews:
            total_like = total_like + models.ReviewLike.objects.filter(review=review.id).count()
        grade = math.floor(total_like / 10) + 1
        if grade > 10:
            grade = 10
        user.grade = grade
        user.save()

    def post(self, request):
        received_data = request.data
        print(received_data)

        is_existed = models.ReviewLike.objects.filter(user=received_data["user"], review=received_data["review"]).exists()
        if is_existed:
            result = {"result": False}
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        review_like_serializer = serializers.ReviewLikeSerializer(data=received_data)
        if review_like_serializer.is_valid():
            review_id = review_like_serializer.save().review.id
            self.decide_grade(review_id)

            result = {"result": True}
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            result = {"error": review_like_serializer.errors}
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, review_id):
        review_like = self.get_object(user_id, review_id)
        if review_like != -1:
            review_like.delete()
            self.decide_grade(review_like.review.id)
            result = {"result": True}
            return Response(result, status=status.HTTP_200_OK)
        else:
            result = {"result": False}
            return Response(result, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def recommend_list(request):
    if request.method == 'POST':
        data = json.loads(request.body, encoding='utf-8')
        return_type = data["type"]
        price = data["price"]
        place = data.get("place")
        category = data.get("category")
        pageno = data.get('pageno')
    else:
        return
    
    if place == None:
        place = list(models.Store.objects.filter(address__contains='서울').values_list('area', flat=True).distinct())[:30]
    if category == None:
        category = ['한식', '일식', '기타', '카페/디저트', '양식', '세계요리', '술집', '중식','뷔페']

    min_price = Q(price_mean__gte=price[0])
    max_price = Q(price_mean__lte=price[1])

    selected_store_list = list(models.Store.objects.filter(min_price & max_price).filter(area__in=place).filter(
        classification__in=category).values_list('id', flat=True))
    if return_type == 'recommend':
        # 유저아이디 넣어야함
        data = request.headers.get('token')
        if data == None:
            selected_store_list = algorithm.recommend(selected_store_list)
        else:
            user = get_jwt_payload(request)
            user_id = user['id']
            vendor = user['vendor']
            selected_store_list = algorithm.recommend(selected_store_list, user_id)
    # stores = pd.DataFrame(list(models.Store.objects.filter(id__in=selected_store_list).values()))
    # reviews = pd.DataFrame(list(models.Review.objects.filter(store_id__in=selected_store_list).values()))

    store_list = list()
    review_list = list()
    for store_id in selected_store_list:
        for i in list(models.Store.objects.filter(id=store_id).values()):
            store_list.append(i)
        for i in list(models.Review.objects.filter(store_id=store_id).values()):
            review_list.append(i)

    stores = pd.DataFrame(store_list)
    reviews = pd.DataFrame(review_list)

    try:
        stores_reviews = pd.merge(
            stores, reviews, left_on="id", right_on="store_id"
        )
    except:
        result = {"result": False}
        return Response(result, status=status.HTTP_204_NO_CONTENT)
    
    if return_type == 'recommend':
        stores_reviews = stores_reviews.groupby(["id_x", "store_name"]).mean()
    elif return_type == 'rating':
        stores_reviews = stores_reviews.groupby(["id_x", "store_name"]).mean().sort_values(by=['score'],
                                                                                           ascending=[False])

    stores_reviews_index_list = stores_reviews.index.tolist()
    dataList = []

    for index, item in enumerate(stores_reviews.values.tolist()):
        if index == 100:
            break
        data = {}
        data['name'] = stores_reviews_index_list[index][1]
        data['latitude'] = item[0]
        data['longitude'] = item[1]
        data['price_mean'] = item[2]
        data['store_id'] = item[4]
        data['score'] = item[6]
        data['classification'] = models.Store.objects.get(id=int(data['store_id'])).classification
        data['area'] = models.Store.objects.get(id=int(data['store_id'])).area
        data['tel'] = models.Store.objects.get(id=int(data['store_id'])).tel
        data['address'] = models.Store.objects.get(id=int(data['store_id'])).address

        cnt = len(list(models.Review.objects.filter(taste__gt=0)))
        if cnt == 0:
            data['taste'] = 0
            data['service'] = 0
            data['price_satisfaction'] = 0
            data['interior'] = 0
            dataList.append(data)
            continue

        data['taste'] = item[7] * len(stores_reviews) / cnt
        data['service'] = item[8] * len(stores_reviews) / cnt
        data['price_satisfaction'] = item[9] * len(stores_reviews) / cnt
        data['interior'] = item[10] * len(stores_reviews) / cnt
        dataList.append(data)

    paginator = Paginator(dataList, 10)

    resultlist = []
    if pageno == None :
        pageno = 1
    for p in paginator.page(pageno):
        resultlist.append(p)

    result = {}
    result['total_page'] = paginator.num_pages
    result['result'] = resultlist

    json_result = json.dumps(result, indent=4, ensure_ascii=False)
    return HttpResponse(json_result)


@api_view(['GET'])
def autocomplete(request, sentence):
    if request.method == 'GET':
        store_name_list = list(models.Store.objects.filter(store_name__startswith=sentence).values_list('id', flat=True).distinct())[:50]
        area_list = list(models.Store.objects.filter(area__startswith=sentence).values_list('id', flat=True).distinct())[:50]
        category_list = list(models.Store.objects.filter(category__startswith=sentence).values_list('id', flat=True).distinct())[:50]
        menu_list = list(models.Menu.objects.filter(menu_name__startswith=sentence).values_list('store_id', flat=True).distinct())[:50]

        store_list = set()
        store_list.update(store_name_list)
        store_list.update(area_list)
        store_list.update(category_list)
        store_list.update(menu_list)
        store_list = list(store_list)

        store_list.sort(key=lambda store_id: models.Review.objects.filter(store_id=store_id).count(), reverse=True)
        store_name_list = list(models.Store.objects.filter(store_name__startswith=sentence).filter(id__in=store_list[:15]).values_list('store_name', flat=True).distinct())[:50]
        area_list = list(models.Store.objects.filter(area__startswith=sentence).filter(id__in=store_list[:15]).values_list('area', flat=True).distinct())[:50]
        category_list = list(models.Store.objects.filter(category__startswith=sentence).filter(id__in=store_list[:15]).values_list('category', flat=True).distinct())[:50]
        menu_list = list(models.Menu.objects.filter(menu_name__startswith=sentence).filter(store_id__in=store_list[:15]).values_list('menu_name', flat=True).distinct())[:50]
           
        result = []

        for item in store_name_list:
            data = {}
            data['type'] = 'name'
            data['sentence'] = item
            result.append(data)

        for item in area_list:
            data = {}
            data['type'] = 'area'
            data['sentence'] = item
            result.append(data)

        for item in category_list:
            data = {}
            data['type'] = 'category'
            data['sentence'] = item
            result.append(data)

        for item in menu_list:
            data = {}
            data['type'] = 'menu'
            data['sentence'] = item
            result.append(data)

        json_result = json.dumps(result, indent=4, ensure_ascii=False)
        return HttpResponse(json_result)


@api_view(['GET'])
def search_list(request, type, sentence):
    if request.method == 'GET':
        return_type = type
        if return_type == 'name':
            selected_store_list = list(models.Store.objects.filter(store_name__startswith=sentence).values_list('id', flat=True).distinct())
        elif return_type == 'area':
            selected_store_list = list(models.Store.objects.filter(area__startswith=sentence).values_list('id', flat=True).distinct())
        elif return_type == 'category':
            selected_store_list = list(models.Store.objects.filter(category__contains=sentence).values_list('id', flat=True).distinct())
        elif return_type == 'menu':
            selected_store_list = list(models.Menu.objects.filter(menu_name__startswith=sentence).values_list('store_id', flat=True).distinct())
        elif return_type == 'all':
            name_list = list(models.Store.objects.filter(store_name__startswith=sentence).values_list('id', flat=True).distinct())
            area_list = list(models.Store.objects.filter(area__startswith=sentence).values_list('id', flat=True).distinct())
            name_area_list = set()
            name_area_list.update(name_list)
            name_area_list.update(area_list)
            selected_store_list = list(name_area_list)

        store_list = list()
        review_list = list()
        for store_id in selected_store_list:
            for i in list(models.Store.objects.filter(id=store_id).values()):
                store_list.append(i)
            for i in list(models.Review.objects.filter(store_id=store_id).values()):
                review_list.append(i)

        stores = pd.DataFrame(store_list)
        reviews = pd.DataFrame(review_list)

        try:
            stores_reviews = pd.merge(
                stores, reviews, left_on="id", right_on="store_id"
            )
        except:
            result = {"result": False}
            return Response(result, status=status.HTTP_204_NO_CONTENT)

        stores_reviews = stores_reviews.groupby(["id_x", "store_name"]).mean().sort_values(by=['score'], ascending=[False])

        stores_reviews_index_list = stores_reviews.index.tolist()
        result = {}
        dataList = []

        for index, item in enumerate(stores_reviews.values.tolist()):
            data = {}
            data['name'] = stores_reviews_index_list[index][1]
            data['latitude'] = item[0]
            data['longitude'] = item[1]
            data['price_mean'] = item[2]
            data['store_id'] = item[4]
            data['score'] = item[6]
            store = models.Store.objects.get(id=int(data['store_id']))
            data['classification'] = store.classification
            data['area'] = store.area
            data['tel'] = store.tel
            data['address'] = store.address

            cnt = len(list(models.Review.objects.filter(taste__gt=0)))
            if cnt == 0:
                data['taste'] = 0
                data['service'] = 0
                data['price_satisfaction'] = 0
                data['interior'] = 0
                dataList.append(data)
                continue

            data['taste'] = item[7] * len(stores_reviews) / cnt
            data['service'] = item[8] * len(stores_reviews) / cnt
            data['price_satisfaction'] = item[9] * len(stores_reviews) / cnt
            data['interior'] = item[10] * len(stores_reviews) / cnt
            dataList.append(data)

        paginator = Paginator(dataList, 10)

        resultlist = []

        for p in paginator.page(1):
            resultlist.append(p)

        result['total_page'] = paginator.num_pages
        result['result'] = resultlist

        json_result = json.dumps(result, indent=4, ensure_ascii=False)
        return HttpResponse(json_result)

@api_view(['GET'])
def search_list_page(request, type, sentence, page_no):
    if request.method == 'GET':
        return_type = type

        if return_type == 'name':
            selected_store_list = list(models.Store.objects.filter(store_name__startswith=sentence).values_list('id', flat=True).distinct())
        elif return_type == 'area':
            selected_store_list = list(models.Store.objects.filter(area__startswith=sentence).values_list('id', flat=True).distinct())
        elif return_type == 'category':
            selected_store_list = list(models.Store.objects.filter(category__contains=sentence).values_list('id', flat=True).distinct())
        elif return_type == 'menu':
            selected_store_list = list(models.Menu.objects.filter(menu_name__startswith=sentence).values_list('store_id', flat=True).distinct())
        elif return_type == 'all':
            name_list = list(models.Store.objects.filter(store_name__startswith=sentence).values_list('id', flat=True).distinct())
            area_list = list(models.Store.objects.filter(area__startswith=sentence).values_list('id', flat=True).distinct())
            name_area_list = set()
            name_area_list.update(name_list)
            name_area_list.update(area_list)
            selected_store_list = list(name_area_list)

        store_list = list()
        review_list = list()
        for store_id in selected_store_list:
            for i in list(models.Store.objects.filter(id=store_id).values()):
                store_list.append(i)
            for i in list(models.Review.objects.filter(store_id=store_id).values()):
                review_list.append(i)

        stores = pd.DataFrame(store_list)
        reviews = pd.DataFrame(review_list)

        try:
            stores_reviews = pd.merge(
                stores, reviews, left_on="id", right_on="store_id"
            )
        except:
            result = {"result": False}
            return Response(result, status=status.HTTP_204_NO_CONTENT)
        

        stores_reviews = stores_reviews.groupby(["id_x", "store_name"]).mean().sort_values(by=['score'], ascending=[False])

        stores_reviews_index_list = stores_reviews.index.tolist()
        result = {}
        dataList = []

        for index, item in enumerate(stores_reviews.values.tolist()):
            data = {}
            data['name'] = stores_reviews_index_list[index][1]
            data['latitude'] = item[0]
            data['longitude'] = item[1]
            data['price_mean'] = item[2]
            data['store_id'] = item[4]
            data['score'] = item[6]
            store = models.Store.objects.get(id=int(data['store_id']))
            data['classification'] = store.classification
            data['area'] = store.area
            data['tel'] = store.tel
            data['address'] = store.address

            cnt = len(list(models.Review.objects.filter(taste__gt=0)))
            if cnt == 0:
                data['taste'] = 0
                data['service'] = 0
                data['price_satisfaction'] = 0
                data['interior'] = 0
                dataList.append(data)
                continue

            data['taste'] = item[7] * len(stores_reviews) / cnt
            data['service'] = item[8] * len(stores_reviews) / cnt
            data['price_satisfaction'] = item[9] * len(stores_reviews) / cnt
            data['interior'] = item[10] * len(stores_reviews) / cnt
            dataList.append(data)

        paginator = Paginator(dataList, 10)

        resultlist = []
        

        for p in paginator.page(page_no):
            resultlist.append(p)
        
        result['total_page'] = paginator.num_pages
        result['result'] = resultlist

        json_result = json.dumps(result, indent=4, ensure_ascii=False)
        return HttpResponse(json_result)
        

@api_view(['GET'])
def recommended_by_store(request, store_id):
    if request.method == 'GET':
        ob = list(models.Review.objects.filter(store_id=store_id))
        if len(ob) == 0:
            store = models.Store.objects.get(id=store_id)
            selected_store_list = list(models.Store.objects.filter(area__contains=store.area).filter(classification=store.classification).exclude(id=store_id).values_list('id', flat=True)[:150])
        else:
            store_name_list = algorithm.svd(store_id)
            store = models.Store.objects.get(id=store_id)
            selected_store_list = list(models.Store.objects.filter(store_name__in=store_name_list).filter(area__contains=store.area).exclude(id=store_id).values_list('id', flat=True)[:150])
        
        stores = pd.DataFrame(list(models.Store.objects.filter(id__in=selected_store_list).values()))
        reviews = pd.DataFrame(list(models.Review.objects.filter(store_id__in=selected_store_list).values()))

        try:
            stores_reviews = pd.merge(
                stores, reviews, left_on="id", right_on="store_id"
            )
        except:
            result = {"result": False}
            return Response(result, status=status.HTTP_204_NO_CONTENT)

        stores_reviews = stores_reviews.groupby(["id_x", "store_name"]).mean().sort_values(by=['score'], ascending=[False])

        stores_reviews_index_list = stores_reviews.index.tolist()
        result = {}
        dataList = []

        for index, item in enumerate(stores_reviews.values.tolist()):
            if index == 7:
                break
            data = {}
            data['name'] = stores_reviews_index_list[index][1]
            data['latitude'] = item[0]
            data['longitude'] = item[1]
            data['price_mean'] = item[2]
            data['store_id'] = item[4]
            data['score'] = item[6]
            data['classification'] = models.Store.objects.get(id=int(data['store_id'])).classification
            data['area'] = models.Store.objects.get(id=int(data['store_id'])).area
            data['tel'] = models.Store.objects.get(id=int(data['store_id'])).tel
            data['address'] = models.Store.objects.get(id=int(data['store_id'])).address

            cnt = len(list(models.Review.objects.filter(taste__gt=0)))
            if cnt == 0:
                data['taste'] = 0
                data['service'] = 0
                data['price_satisfaction'] = 0
                data['interior'] = 0
                dataList.append(data)
                continue

            data['taste'] = item[7] * len(stores_reviews) / cnt
            data['service'] = item[8] * len(stores_reviews) / cnt
            data['price_satisfaction'] = item[9] * len(stores_reviews) / cnt
            data['interior'] = item[10] * len(stores_reviews) / cnt
            dataList.append(data)

        result['result'] = dataList
        json_result = json.dumps(result, indent=4, ensure_ascii=False)
        # return Response(json_result, status=status.HTTP_200_OK)
        return HttpResponse(json_result)


def get_jwt_payload(request):
    try:
        token = request.headers['token']
        print(token)
        data = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        print(data['user'])
        print(data['access_token'])
        return data['user'], data['access_token']

    except jwt.exceptions.InvalidTokenError:
        return JsonResponse({'message': 'INVALID TOKEN'}, status=401)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    queryset = models.User.objects.all()

    def list(self, request, *args, **kwargs):
        return JsonResponse({"message": "올바르지 않은 접근입니다."}, status=401)

    def retrieve(self, request, *args, **kwargs):
        return JsonResponse({"message": "올바르지 않은 접근입니다."}, status=401)

    def update(self, request, *args, **kwargs):
        return JsonResponse({"message": "올바르지 않은 접근입니다."}, status=401)

    def destroy(self, request, *args, **kwargs):
        return JsonResponse({"message": "올바르지 않은 접근입니다."}, status=401)

    def create(self, request, *args, **kwargs):
        return JsonResponse({"message": "올바르지 않은 접근입니다."}, status=401)

    @action(methods=['delete'], detail=False, url_name='delete', url_path='delete')
    def delete(self, request):
        user, access_token = get_jwt_payload(request)
        instance = models.User.objects.get(id=user['id'], vendor=user['vendor'])
        self.perform_destroy(instance)

        delete_request = requests.post(
            'https://kapi.kakao.com/v1/user/unlink',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        if delete_request.status_code == 200:
            return JsonResponse({'message': '회원 탈퇴되었습니다.'}, status=200)
        else:
            return JsonResponse({'message': '회원 탈퇴 실패'}, status=400)

    @action(methods=['put'], detail=False, url_name='modify', url_path='modify')
    def modify(self, request, *args, **kwargs):
        user, access_token = get_jwt_payload(request)
        partial = kwargs.pop('partial', False)
        instance = models.User.objects.get(id=user['id'], vendor=user['vendor'])
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='mypage', url_name='mypage')
    def my_page(self, request):
        user, access_token = get_jwt_payload(request)
        user = models.User.objects.get(id=user['id'], vendor=user['vendor'])
        serializer = self.get_serializer(user)
        my_reviews = serializer.data['my_reviews']
        for r in my_reviews:
            r['store'] = serializers.StoreSerializer(models.Store.objects.get(id=r['store'])).data

        return Response(serializer.data)

    @action(methods=['post'], detail=False, url_path='kakao', url_name='kakao')
    def kakao_login(self, request):
        access_token = request.data.get("access_token", "access_token")
        vendor = request.data.get("provider", "provider")
        profile_request = requests.get(
            'https://kapi.kakao.com/v2/user/me',
            headers={'Authorization': f'Bearer {access_token}'}
        )

        profile_json = profile_request.json()
        kakao_account = profile_json['kakao_account']
        kakao_id = profile_json['id']

        if models.User.objects.filter(id=kakao_id, vendor=vendor).exists():
            user = models.User.objects.filter(id=kakao_id, vendor=vendor).get()
            user = {
                'id': user.id,
                'gender': user.gender,
                'age': user.age,
                'nickname': user.nickname,
                'grade': user.grade,
                'vendor': user.vendor
            }
            token = jwt.encode({'user': user, 'exp': datetime.datetime.now() + datetime.timedelta(hours=3),
                                'access_token': access_token}, settings.SECRET_KEY, algorithm='HS256')
            token = token.decode('utf-8')
            return JsonResponse({'token': token}, status=200)
        else:
            nickname = kakao_account['profile'].get('nickname', None)
            age_range = kakao_account.get('age_range', '20~29')
            age = (int(age_range.split('~')[0]) + int(age_range.split('~')[1])) / 2
            age = round(2020 - age)
            gender = kakao_account.get('gender', None)

            if gender is not None:
                if gender == 'female':
                    gender = '여'
                else:
                    gender = '남'
            models.User(
                id=kakao_id,
                gender=gender,
                age=age,
                nickname=nickname,
                grade=0,
                vendor=vendor,
                refresh_token=None
            ).save()

            user = models.User.objects.filter(id=kakao_id).get()
            user = {
                'id': user.id,
                'gender': user.gender,
                'age': user.age,
                'nickname': user.nickname,
                'grade': user.grade,
                'vendor': user.vendor
            }
            token = jwt.encode({'user': user, 'exp': datetime.datetime.now() + datetime.timedelta(hours=3),
                                'access_token': access_token}, settings.SECRET_KEY, algorithm='HS256')
            token = token.decode('utf-8')
            return JsonResponse({'token': token}, status=200)
