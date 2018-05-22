# django-react

## Recreation Steps

### Getting Started with Django

Create directory
```
mkdir django-react && cd $_
```

Create virtual environment
```
pipenv --three
```

Install django and drf
```
pipenv install django djangorestframework
```

Start env shell
```
pipenv shell
```

Start project
```
django-admin startproject vanilla
```

Start flag-checker app
```
cd vanilla
django-admin startapp flagChecker
```

Change `vanilla/settings.py` to
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'flagChecker', # adding the flagChecker app
]
```

Change `flagChecker/models.py` to
```
from django.db import models

class Flag(models.Model):
  flag = models.CharField(max_length=50)
```

Model in place, create migration and migrate
```
python manage.py makemigrations flagChecker
python manage.py migrate
```

Create serializers 
```
touch flagChecker/serializers.py
```

Change `flagChecker/serializers.py` to
```
from rest_framework import serializers
from flagChecker.models import Flag     

class FlagSerializer(serializers.ModelSerializer):
  class Meta:
    model = Flag
    fields = '__all__'
```

Change `flagChecker/views.py` to
```
from django.shortcuts import render
from flagChecker.models import Flag
from flagChecker.serializers import FlagSerializer
from rest_framework import generics

class FlagCreate(generics.ListCreateAPIView):
  queryset = Flag.objects.all()
  serializer_class = FlagSerializer
```

Change `vanilla/urls.py` to
```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
  path('admin/', admin.site.urls),
]

urlpatterns = [
  path('', include('flagChecker.urls')),
]
```

Configure URL mapping by creating `urls.py` in app
```
touch flagChecker/urls.py
```

Change `flagChecker/urls.py` to
```
from django.urls import path
from . import views

urlpatterns = [
  path('api/flags/', views.FlagCreate.as_view() ),
]
```

Change `vanilla/settings/py` to
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'flagChecker', # adding the flagChecker app
    'rest_framework', # enable rest framework
]
```

Now run `python manage.py runserver` and browse to http://localhost:8000/api/flags/ to see the browseable API.


Create fixtures for temp data
```
mkdir flagChecker/fixtures
touch flagChecker/fixtures/flags.json
```

Change `flagChecker/fixtures/flags.json` to
```
[
  {
    "model": "flagChecker.flag",
    "pk": "1",
    "fields": {
      "flag": "testflag"
    }
  }
]
```

Load data
```
python manage.py loaddata flags
```

Run again and should be able to see temp data
```
python manage.py runserver
```

Browse to http://localhost:8000/api/flags/ 

### Adding and Configuring a Client

Create client app and scaffolding
```
django-admin startapp client
mkdir -p client/src/components
mkdir -p client/{static,templates}/client
```

Build out webpack in `django-react/`
```
cd ..
npm init -y
npm i webpack webpack-cli --save-dev
```

Change `package.json` to
```
{
  "name": "django-react",
  "version": "1.0.0",
  "description": "clevernyyyy is the best",
  "main": "index.js",
  "scripts": {
    "dev": "webpack --mode development ./vanilla/client/src/index.js --output ./vanilla/client/static/client/main.js",
    "build": "webpack --mode production ./vanilla/client/src/index.js --output ./vanilla/client/static/client/main.js"
  },
  "keywords": [],
  "author": "clevernyyyy",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^4.8.3",
    "webpack-cli": "^2.1.3"
  }
}
```

Install babel
```
npm i babel-core babel-loader babel-preset-env babel-preset-react babel-plugin-transform-class-properties --save-dev
```

Install ReactJS
```
npm i react react-dom prop-types --save-dev
```

Add `django-react/.babelrc` and the below contents
```
{
    "presets": [
        "env", "react"
    ],
    "plugins": [
        "transform-class-properties"
    ]
}
```

Create `django-react/webpack.config.js` and add the below contents
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```

### Wiring the Front End
Edit `django-react/vanilla/client/views.py` to
```
from django.shortcuts import render
def index(request):
    return render(request, 'client/index.html')
```

Next, add `django-react/vanilla/client/templates/client/index.html` and fill with some HTML 
```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css">
  <title>Django-React</title>
</head>
<body>
  <section class="section">
    <div class="container">
          <div id="app" class="columns"><!-- React --></div>
    </div>
  </section>
</body>
{% load static %}
<script src="{% static "client/main.js" %}"></script>
</html>
```

Configure Url mappings by changing `django-react/vanilla/vanilla/urls.py`
```
urlpatterns = [
  path('', include('flagChecker.urls')),
  path('', include('client.urls')),
]
```

Add file `django-react/vanilla/client/urls.py` and the below contents
```
from django.urls import path
from . import views
urlpatterns = [
    path('', views.index ),
]
```

Finally, enable the client in `django-react/vanilla/vanilla/settings.py` by adding
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'flagChecker', # adding the flagChecker app
    'rest_framework', # enable rest framework
    'client', # enable the frontend app
]
```

### Add React Front End
Create React's App.js
```
nano django-react/vanilla/client/src/components/App.js
```

Add the following content
```
import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Table from "./Table";
const App = () => (
  <DataProvider endpoint="api/flags/"
                render={data => <Table data={data} />} />
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
```

Create a DataProvider
```
nano django-react/vanilla/client/src/components/DataProvider.js
```

Add the following content
```
import React, { Component } from "react";
import PropTypes from "prop-types";
class DataProvider extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired
  };
  state = {
      data: [],
      loaded: false,
      placeholder: "Loading..."
    };
  componentDidMount() {
    fetch(this.props.endpoint)
      .then(response => {
        if (response.status !== 200) {
          return this.setState({ placeholder: "Something went wrong" });
        }
        return response.json();
      })
      .then(data => this.setState({ data: data, loaded: true }));
  }
  render() {
    const { data, loaded, placeholder } = this.state;
    return loaded ? this.props.render(data) : <p>{placeholder}</p>;
  }
}
export default DataProvider;
```

Create a Table Component
```
npm i shortid --save-dev
nano django-react/vanilla/client/src/components/Table.js
```

Add content
```
import React from "react";
import PropTypes from "prop-types";
import shortid from "shortid";
const uuid = shortid.generate;
const Table = ({ data }) =>
  !data.length ? (
    <p>Nothing to show</p>
  ) : (
    <div className="column">
      <h2 className="subtitle">
        Showing <strong>{data.length} items</strong>
      </h2>
      <table className="table is-striped">
        <thead>
          <tr>
            {Object.entries(data[0]).map(el => <th key={uuid()}>{el[0]}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(el => (
            <tr key={el.id}>
              {Object.entries(el).map(el => <td key={uuid()}>{el[1]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
Table.propTypes = {
  data: PropTypes.array.isRequired
};
export default Table;
```

Create React App entry point
```
nano django-react/vanilla/client/src/index.js
```

Add the hook
```
import App from "./components/App";
```

Run app to check it out!
```
npm run dev
```

Then
```
python manage.py runserver
```

If you get an error, make sure to populate database
```
python manage.py migrate && python manage.py loaddata flags
```
