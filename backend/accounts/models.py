from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class PastDisaster(models.Model):
    id = models.AutoField(primary_key=True)  # Add this line
    Latitude = models.DecimalField(max_digits=9, decimal_places=7)
    Longitude = models.DecimalField(max_digits=9, decimal_places=7)
    Title = models.TextField()
    Disaster_Year = models.IntegerField()
    Month = models.IntegerField()
    Location = models.TextField()
    State = models.TextField()
    Disaster_Type = models.TextField()
    Total_Deaths = models.IntegerField()
    Total_Injured = models.IntegerField()
    Total_Affected = models.BigIntegerField()
    Economic_Loss_INR = models.BigIntegerField()

    class Meta:
        db_table = 'past_disasters'  # Maps to your existing table
        managed = False  # Since table already exists
        
        
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for admin access
    is_superuser = models.BooleanField(default=False)  # For superuser permissions
    date_joined = models.DateTimeField(auto_now_add=True)  # Recommended

    objects = UserManager()

    USERNAME_FIELD = 'email'
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    @property
    def is_admin(self):
        return self.is_superuser  # Alias for your existing is_admin field