from django.urls import path
from . import views

# Each path() maps a URL pattern to a view function.
# These are mounted under /api/ by core/urls.py, so the full URL is /api/items/ etc.
# <str:item_id> is a URL parameter — Django captures whatever string is there
# and passes it to the view function as the item_id argument.
urlpatterns = [
    # auth/profile/ handles both GET (fetch profile) and PATCH (update username)
    path('auth/profile/',              views.user_profile,        name='user_profile'),
    path('auth/register/',             views.create_user_profile, name='create_user_profile'),
    path('items/',                     views.get_items,           name='get_items'),
    path('items/add/',                 views.add_item,            name='add_item'),
    path('items/<str:item_id>/',       views.get_item,            name='get_item'),
    path('items/<str:item_id>/replace/', views.replace_item,      name='replace_item'),
    path('items/<str:item_id>/update/', views.update_item,        name='update_item'),
    path('items/<str:item_id>/delete/', views.delete_item,        name='delete_item'),
]
