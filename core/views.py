from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "core/index.html")




def special(request):
    return render(request, "core/special.html")



def services(request):
    return render(request, "core/services.html")



def customs(request):
    return render(request, "core/customs.html")



def contacts(request):
    return render(request, "core/contacts.html")



def procurement(request):
    return render(request, "core/procurement.html")



def custom_404(request, exception):
    return render(request, "core/404.html", status=404)
