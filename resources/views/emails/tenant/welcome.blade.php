<x-mail::message>
# Welcome to Research Tracker!

Hi {{ $adminName }},

Your department, **{{ $tenant->name }}**, has been successfully provisioned on the central platform. 

You can now log in to your dedicated portal using the initial credentials below:

**Portal URL:** [http://{{ $tenant->domain }}](http://{{ $tenant->domain }})  
**Email:** `{{ $adminEmail }}`  
**Password:** `{{ $password }}`

Please ensure you change your password immediately after your first login for security purposes.

<x-mail::button :url="'http://' . $tenant->domain">
Access Your Portal
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>
