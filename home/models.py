from django.db import models


class DelegateRegistration(models.Model):
    EXPERIENCE_CHOICES = [
        ('novice',      'Novice'),
        ('experienced', 'Experienced'),
        ('veteran',     'Veteran'),
    ]

    first_name     = models.CharField(max_length=100)
    last_name      = models.CharField(max_length=100)
    school         = models.CharField(max_length=200)
    grade          = models.CharField(max_length=30)
    email          = models.EmailField()
    phone          = models.CharField(max_length=20)
    experience     = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)
    committee_1    = models.CharField(max_length=60)
    committee_2    = models.CharField(max_length=60)
    transaction_id = models.CharField(max_length=120)
    dietary        = models.TextField(blank=True, default='')
    confirmed      = models.BooleanField(default=False)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.first_name} {self.last_name} — {self.school} ({self.committee_1})'
