from django.db import models


class Result(models.Model):
    alert_rating = models.CharField(max_length=100)
    notes = models.TextField()

    def __str__(self):
        return self.alert_rating
