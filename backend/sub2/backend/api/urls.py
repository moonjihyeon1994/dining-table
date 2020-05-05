from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from api import views
# from rest_framework_swagger.views import get_swagger_view
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter(trailing_slash=False)
# router.register("stores", views.StoreViewSet, basename="stores")
# router.register("reviews", views.ReviewViewSet, basename="reviews")
router.register('users', views.UserViewSet, basename='users')
router.register('stores', views.StoreViewSet, basename='stores')

urlpatterns = [ 
    path('search/<str:type>/<str:sentence>/', views.search_list),
    path('search/<str:type>/<str:sentence>/<int:page_no>/', views.search_list_page),
    path('autocomplete/<str:sentence>/', views.autocomplete),
    path('recommended-store/<str:store_id>/', views.recommended_by_store),
    url(r'^', include(router.urls)),
    path('recommend-list', views.recommend_list),

    path('reviews/', views.ReviewViewSet.as_view()),
    path('reviews/<int:pk>/', views.ReviewViewSet.as_view()),
    path('reviews/store/<int:store_id>/', views.ReviewViewSetByStoreId.as_view()),
    path('reviews/images/<int:review_id>/', views.ReviewImageViewSet.as_view()),
    path('reviews/like/<int:user_id>/<int:review_id>/', views.ReviewLikeViewSet.as_view()),
    path('reviews/like/', views.ReviewLikeViewSet.as_view()),
    path("reviews/like/<int:review_id>/", views.ReviewLikeCountViewSet.as_view())
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
