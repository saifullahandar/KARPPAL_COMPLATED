def company_info(request):
    """Make CompanyInfo available in every dashboard template as `company_info`."""
    from apps.core.models import CompanyInfo

    return {"company_info": CompanyInfo.load()}
