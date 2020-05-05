from .models import *
from .models import Store, Review, User
from rest_framework import serializers


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            "id",
            "store_name",
            "area",
            "tel",
            "address",
            "latitude",
            "longitude",
            "category",
            "classification",
            "price_mean"
        ]


class ReviewSerializer(serializers.ModelSerializer):

    # store = StoreSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "store",
            "user",
            "score",
            "content",
            "reg_time",
            "taste",
            "service",
            "price_satisfaction",
            "interior"
        ]


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = "__all__"


class ReviewLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewLike
        fields = [
            "id",
            "review",
            "user"
        ]


class UserSerializer(serializers.ModelSerializer):

    my_reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'gender', 'age', 'nickname', 'grade', 'vendor', 'refresh_token', 'my_reviews']
