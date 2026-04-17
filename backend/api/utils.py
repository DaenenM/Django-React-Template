from functools import wraps
import firebase_admin.auth
from rest_framework.response import Response
from rest_framework import status


def verify_firebase_token(request):
    """Verify Firebase ID token from Authorization header; raises on failure."""
    # The frontend attaches the token as: Authorization: Bearer <token>
    # We strip "Bearer " to get the raw token string.
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        raise ValueError('Authorization header missing or malformed')
    token = auth_header.split('Bearer ')[1]

    # verify_id_token checks the token's signature against Firebase's public keys
    # and confirms it hasn't expired. Returns a dict with uid, email, etc.
    # Raises an exception if the token is invalid or tampered with.
    return firebase_admin.auth.verify_id_token(token)


def require_auth(view_func):
    """
    Decorator for @api_view functions that rejects unauthenticated requests.
    Attaches the decoded token dict to request.decoded_token so the view
    can access uid, email, etc. without calling verify_firebase_token again.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            request.decoded_token = verify_firebase_token(request)
        except Exception:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        return view_func(request, *args, **kwargs)
    return wrapper
