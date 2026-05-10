import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.conf import settings


def index(request):
    context = {
        'conference_date': 'July 31, 2026',
        'edition': 'XIV',
        'slogan': 'Represent. Reason. Resolve.',
    }
    return render(request, 'home/index.html', context)


def faq(request):
    return render(request, 'home/index.html', {})


@csrf_exempt
@require_POST
def contact(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    first   = data.get('firstName', '').strip()
    last    = data.get('lastName', '').strip()
    email   = data.get('email', '').strip()
    message = data.get('message', '').strip()

    if not first or not email or not message:
        return JsonResponse({'error': 'firstName, email and message are required.'}, status=400)

    full_name = f'{first} {last}'.strip()

    try:
        send_mail(
            subject=f'CHIREC MUN 2026 — Enquiry from {full_name}',
            message=(
                f'Name:    {full_name}\n'
                f'Email:   {email}\n'
                f'{"─" * 40}\n\n'
                f'{message}'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_RECIPIENT],
            fail_silently=False,
        )
    except Exception as exc:
        return JsonResponse({'error': f'Mail error: {exc}'}, status=500)

    return JsonResponse({'success': True})
