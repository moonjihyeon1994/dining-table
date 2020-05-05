from django.db import models
import os
from backend import settings
from django.shortcuts import get_object_or_404


class Store(models.Model):
    id = models.AutoField(primary_key=True)
    store_name = models.CharField(max_length=100, null=True)
    area = models.CharField(max_length=100, null=True)
    tel = models.CharField(max_length=30, null=True)
    address = models.CharField(max_length=100, null=True)
    latitude = models.FloatField(max_length=10, null=True)
    longitude = models.FloatField(max_length=10, null=True)
    category = models.CharField(max_length=200, null=True)
    classification = models.CharField(max_length=30, null=True)
    price_mean = models.IntegerField(default=0)

    @property
    def category_list(self):
        return self.category.split("|") if self.category else []


class User(models.Model):
    id = models.AutoField(primary_key=True)
    gender = models.CharField(max_length=2, null=True)
    age = models.IntegerField(null=True)
    nickname = models.CharField(max_length=20, null=True)
    grade = models.IntegerField(default=0)
    vendor = models.CharField(max_length=20, null=True)
    refresh_token = models.CharField(max_length=500, null=True)

    class Meta:
        unique_together = ('id', 'vendor')


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='my_reviews', on_delete=models.CASCADE)
    score = models.IntegerField(null=True)
    content = models.CharField(max_length=2000, null=True)
    reg_time = models.DateTimeField(null=True)
    taste = models.IntegerField(null=True)
    service = models.IntegerField(null=True)
    price_satisfaction = models.IntegerField(null=True)
    interior = models.IntegerField(null=True)

    def delete(self, *args, **kargs):
        review_images = (
            ReviewImage.objects.filter(review=self.id).order_by('id')
        )
        for image in review_images:
            os.remove(os.path.join(settings.MEDIA_ROOT, image.file.path))
            image.delete()
        super(Review, self).delete(*args, **kargs)


class ReviewImage(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(blank=False, null=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)

    def __str__(self):
        return self.file.name


class ReviewLike(models.Model):
    id = models.AutoField(primary_key=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Menu(models.Model):
    id = models.AutoField(primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    menu_name = models.CharField(max_length=200, null=True)
    price = models.FloatField(null=True)


class BHour(models.Model):
    id = models.AutoField(primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    type = models.IntegerField()
    week_type = models.IntegerField()
    mon = models.FloatField(null=True)
    tue = models.FloatField(null=True)
    wed = models.FloatField(null=True)
    thu = models.FloatField(null=True)
    fri = models.FloatField(null=True)
    sat = models.FloatField(null=True)
    sun = models.FloatField(null=True)
    start_time = models.CharField(max_length=10, null=True)
    end_time = models.CharField(max_length=10, null=True)
    etc = models.CharField(max_length=200, null=True)


