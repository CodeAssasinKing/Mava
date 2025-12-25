from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "core/index.html")




def special(request):
    return render(request, "core/special.html")



def services(request):
    return render(request, "core/services.html")