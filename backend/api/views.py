from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import firestore
from .firebase import db
from .utils import require_auth


# Change this to rename the Firestore collection all item endpoints use.
COLLECTION = 'items'

# User roles — ordered from least to most privileged.
# Stored as a string in each user's Firestore document.
ROLES = ['viewer', 'user', 'staff', 'admin']


def _get_doc(item_id):
    """Returns (doc_ref, doc). Caller checks doc.exists for 404 handling."""
    doc_ref = db.collection(COLLECTION).document(item_id)
    return doc_ref, doc_ref.get()


# ── User Profile ──────────────────────────────────────────────────────────────

@api_view(['GET', 'PATCH'])
@require_auth
def user_profile(request):
    uid = request.decoded_token['uid']
    doc_ref = db.collection('users').document(uid)

    if request.method == 'GET':
        doc = doc_ref.get()
        if not doc.exists:
            return Response({'username': '', 'email': request.decoded_token.get('email', '')})
        return Response(doc.to_dict())

    if request.method == 'PATCH':
        # Whitelist which fields the user is allowed to change themselves.
        # Role, XP, and coins are controlled server-side only.
        allowed = {'username'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        doc_ref.update(data)
        return Response({'message': 'Profile updated'})


@api_view(['POST'])
@require_auth
def create_user_profile(request):
    """
    Called after registration (email or Google) to create/sync the Firestore profile.
    New users get default role/XP/coins. Returning Google users only get their email updated.
    """
    uid = request.decoded_token['uid']
    doc_ref = db.collection('users').document(uid)
    doc = doc_ref.get()

    if doc.exists:
        # Returning user (e.g. Google sign-in after first time).
        # Only update email — never reset XP, coins, or role.
        doc_ref.update({'email': request.data.get('email', request.decoded_token.get('email', ''))})
    else:
        # Brand new user — set up the full profile with defaults.
        doc_ref.set({
            'uid': uid,
            'username': request.data.get('username', request.decoded_token.get('name', '')),
            'email': request.data.get('email', request.decoded_token.get('email', '')),
            'role': 'user',
            'xp': 0,
            'coins': 100,
            'created_at': firestore.SERVER_TIMESTAMP,
        })

    return Response({'message': 'Profile synced'}, status=status.HTTP_201_CREATED)


# ── Items ─────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@require_auth
def get_items(request):
    items = []
    for doc in db.collection(COLLECTION).stream():
        item = doc.to_dict()
        item['id'] = doc.id
        items.append(item)
    return Response(items)


@api_view(['GET'])
@require_auth
def get_item(request, item_id):
    _, doc = _get_doc(item_id)
    if not doc.exists:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({**doc.to_dict(), 'id': doc.id})


@api_view(['POST'])
@require_auth
def add_item(request):
    doc_ref = db.collection(COLLECTION).add(request.data)
    return Response({'id': doc_ref[1].id}, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@require_auth
def replace_item(request, item_id):
    doc_ref, doc = _get_doc(item_id)
    if not doc.exists:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    doc_ref.set(request.data)
    return Response({'id': item_id, 'data': request.data})


@api_view(['PATCH'])
@require_auth
def update_item(request, item_id):
    doc_ref, doc = _get_doc(item_id)
    if not doc.exists:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    doc_ref.update(request.data)
    return Response({'id': item_id, 'data': {**doc.to_dict(), **request.data}})


@api_view(['DELETE'])
@require_auth
def delete_item(request, item_id):
    doc_ref, doc = _get_doc(item_id)
    if not doc.exists:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    doc_ref.delete()
    return Response({'message': 'Item deleted'}, status=status.HTTP_200_OK)
