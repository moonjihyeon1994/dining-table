from django.conf.urls import url
from django.urls import path, include
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from drf_yasg import openapi

schema_url_patterns = [
    path('api/', include('api.urls')),
]

schema_view = get_schema_view(
    openapi.Info(
        title="미식가의 식탁",
        default_version='v1',
        description=
        '''
        안녕하세요
        싸피 2기 빅데이터 팀     
        ''',
    ),
    validators=['flex'],
    public=True,
    permission_classes=(AllowAny,),
    patterns=schema_url_patterns,
)
