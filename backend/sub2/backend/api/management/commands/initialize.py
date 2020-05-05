from pathlib import Path
import pandas as pd
from django.core.management.base import BaseCommand
from backend import settings
from api import models


class Command(BaseCommand):
    help = "initialize database"
    DATA_DIR = Path(settings.BASE_DIR).parent.parent / "data"
    DATA_FILE = str(DATA_DIR / "final_dump.pkl")

    def _load_dataframes(self):
        try:
            data = pd.read_pickle(Command.DATA_FILE)
        except FileNotFoundError:
            print(f"[-] Reading {Command.DATA_FILE} failed")
            exit(1)
        return data

    def _initialize(self):
        """
        Sub PJT 1에서 만든 Dataframe을 이용하여 DB를 초기화합니다.
        """
        print("[*] Loading data...")
        df = self._load_dataframes()

        print("[*] Initializing stores...")
        models.Store.objects.all().delete()
        stores = df["stores"]
        stores_bulk = [
            models.Store(
                id=store.id,
                store_name=store.store_name,
                area=store.area,
                tel=store.tel,
                address=store.address,
                latitude=store.latitude,
                longitude=store.longitude,
                category=store.category,
                classification=store.classification,
                price_mean=store.price_mean
            )
            for store in stores.itertuples()
        ]
        models.Store.objects.bulk_create(stores_bulk)
        print("[+] Stores Complete")

        print("[*] Initializing users...")
        models.User.objects.all().delete()
        users = df['users']
        users_bulk = [
            models.User(
                id=user.id,
                gender=user.gender,
                age=user.age,
                grade=user.grade,
                vendor=user.vendor,
                refresh_token=user.refresh_token
            ) for user in users.itertuples()
        ]
        models.User.objects.bulk_create(users_bulk)
        print("[+] Users Complete")

        print("[*] Initializing reviews...")
        models.Review.objects.all().delete()
        reviews = df['reviews']
        reviews_bulk = [
            models.Review(
                id=review.id,
                store=models.Store.objects.get(id=review.store),
                user=models.User.objects.get(id=review.user),
                score=review.score,
                content=review.content,
                reg_time=review.reg_time,
                taste=review.taste,
                service=review.service,
                price_satisfaction=review.price_satisfaction,
                interior=review.interior
            ) for review in reviews.itertuples()
        ]
        models.Review.objects.bulk_create(reviews_bulk)
        print("[+] Reviews Complete")

        print("[*] Initializing Menu...")
        models.Menu.objects.all().delete()
        menu = df['menu']
        menu_bulk = [
            models.Menu(
                id=m.id,
                store=models.Store.objects.get(id=m.store),
                menu_name=m.menu_name,
                price=m.price
            ) for m in menu.itertuples()
        ]
        models.Menu.objects.bulk_create(menu_bulk)
        print("[+] Menu Complete")

        print("[*] Initializing BHour...")
        models.BHour.objects.all().delete()
        b_hours = df['bhours']
        bhour_bulk = [
            models.BHour(
                id=b_hour.id,
                store=models.Store.objects.get(id=b_hour.store),
                type=b_hour.type,
                week_type=b_hour.week_type,
                mon=b_hour.mon,
                tue=b_hour.tue,
                wed=b_hour.wed,
                thu=b_hour.thu,
                fri=b_hour.fri,
                sat=b_hour.sat,
                sun=b_hour.sun,
                start_time=b_hour.start_time,
                end_time=b_hour.end_time,
                etc=b_hour.etc
            ) for b_hour in b_hours.itertuples()
        ]
        models.BHour.objects.bulk_create(bhour_bulk)
        print("[+] BHour Complete")

        print("[+] Done")

    def handle(self, *args, **kwargs):
        self._initialize()
