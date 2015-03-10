from django.shortcuts import render

def ahem(request):
    return render(request, 'ahem/index.html')
