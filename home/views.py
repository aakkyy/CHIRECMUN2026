import json
import os
import resend
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
from .models import DelegateRegistration

resend.api_key = os.environ.get('RESEND_API_KEY', '')


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
    recipient = os.environ.get('CONTACT_RECIPIENT', 'contact.mun@chirec.ac.in')

    try:
        resend.Emails.send({
            'from': 'CHIREC MUN <onboarding@resend.dev>',
            'to': [recipient],
            'subject': f'CHIREC MUN 2026 — Enquiry from {full_name}',
            'text': (
                f'Name:    {full_name}\n'
                f'Email:   {email}\n'
                f'{"─" * 40}\n\n'
                f'{message}'
            ),
        })
    except Exception as exc:
        return JsonResponse({'error': f'Mail error: {exc}'}, status=500)

    return JsonResponse({'success': True})


@csrf_exempt
@require_POST
def register(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    required = ['firstName', 'lastName', 'school', 'grade', 'email',
                'phone', 'experience', 'committee1', 'committee2', 'transactionId']
    for field in required:
        if not str(data.get(field, '')).strip():
            return JsonResponse({'error': f'{field} is required.'}, status=400)

    reg = DelegateRegistration.objects.create(
        first_name     = data['firstName'].strip(),
        last_name      = data['lastName'].strip(),
        school         = data['school'].strip(),
        grade          = data['grade'].strip(),
        email          = data['email'].strip(),
        phone          = data['phone'].strip(),
        experience     = data['experience'].strip(),
        committee_1    = data['committee1'].strip(),
        committee_2    = data['committee2'].strip(),
        transaction_id = data['transactionId'].strip(),
        dietary        = data.get('dietary', '').strip(),
    )

    full_name = f"{reg.first_name} {reg.last_name}"

    recipient = os.environ.get('CONTACT_RECIPIENT', 'contact.mun@chirec.ac.in')

    # Confirmation to delegate
    try:
        resend.Emails.send({
            'from': 'CHIREC MUN <onboarding@resend.dev>',
            'to': [reg.email],
            'subject': 'CHIREC MUN 2026 — Registration Received',
            'text': (
                f'Dear {reg.first_name},\n\n'
                f'Your registration for CHIREC MUN 2026 has been received!\n\n'
                f'Details:\n'
                f'  Name:          {full_name}\n'
                f'  School:        {reg.school}\n'
                f'  Committee 1:   {reg.committee_1}\n'
                f'  Committee 2:   {reg.committee_2}\n'
                f'  Transaction ID: {reg.transaction_id}\n\n'
                f'The Secretariat will verify your payment and confirm your spot within 48 hours.\n\n'
                f'See you at the conference!\n'
                f'CHIREC MUN 2026 Secretariat'
            ),
        })
    except Exception:
        pass

    # Notify organizers
    try:
        resend.Emails.send({
            'from': 'CHIREC MUN <onboarding@resend.dev>',
            'to': [recipient],
            'subject': f'New Registration #{reg.id}: {full_name} — {reg.school}',
            'text': (
                f'New delegate registration:\n\n'
                f'  Name:          {full_name}\n'
                f'  School:        {reg.school}\n'
                f'  Grade:         {reg.grade}\n'
                f'  Email:         {reg.email}\n'
                f'  Phone:         {reg.phone}\n'
                f'  Experience:    {reg.experience}\n'
                f'  Committee 1:   {reg.committee_1}\n'
                f'  Committee 2:   {reg.committee_2}\n'
                f'  Transaction ID: {reg.transaction_id}\n'
                f'  Dietary:       {reg.dietary or "None"}\n'
            ),
        })
    except Exception:
        pass

    return JsonResponse({'success': True, 'id': reg.id})
