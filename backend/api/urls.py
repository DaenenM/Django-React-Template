from django.urls import path
from . import views

# Each path() maps a URL pattern to a view function.
# These are mounted under /api/ by core/urls.py, so the full URL is /api/<collection>/ etc.
# <str:collection> captures the collection name from the URL (e.g. "items", "products").
# <str:item_id> captures the Firestore document ID.
urlpatterns = [
    path('auth/profile/',                          views.user_profile,        name='user_profile'),
    path('auth/register/',                         views.create_user_profile, name='create_user_profile'),

    # Generic collection CRUD — the collection name comes from the URL, not hardcoded.
    path('<str:collection>/',                       views.get_items,           name='get_items'),
    path('<str:collection>/add/',                   views.add_item,            name='add_item'),
    path('<str:collection>/<str:item_id>/',         views.get_item,            name='get_item'),
    path('<str:collection>/<str:item_id>/replace/', views.replace_item,        name='replace_item'),
    path('<str:collection>/<str:item_id>/update/',  views.update_item,         name='update_item'),
    path('<str:collection>/<str:item_id>/delete/',  views.delete_item,         name='delete_item'),
]
