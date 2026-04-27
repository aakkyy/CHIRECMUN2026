from django.shortcuts import render


def index(request):
    context = {
        'conference_date': 'July 31, 2026',
        'edition': 'XIV',
        'slogan': 'Represent. Reason. Resolve.',
    }
    return render(request, 'home/index.html', context)
