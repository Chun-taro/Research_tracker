<x-mail::message>
# Welcome to Research Tracker, {{ $user->name }}!

Your account has been created successfully. You can now log in to the platform using the following credentials:

**Email:** {{ $user->email }}
**Temporary Password:** {{ $password }}

<x-mail::button :url="$loginUrl">
Log In Now
</x-mail::button>

> [!IMPORTANT]
> For security reasons, please change your password immediately after your first login.

If you did not expect this email, please contact your portal administrator.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
