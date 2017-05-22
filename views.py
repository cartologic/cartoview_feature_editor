import json
import random
import string
import requests
from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required
from . import APP_NAME, __version__

from geonode.layers.views import _resolve_layer, _PERMISSION_MSG_MODIFY
from geonode.geoserver.helpers import ogc_server_settings, set_styles
from django.http import QueryDict
from geoserver.catalog import Catalog

@login_required
def index(request):
    context = {
        "v": __version__
    }
    return render(request, "%s/index.html" % APP_NAME, context)
