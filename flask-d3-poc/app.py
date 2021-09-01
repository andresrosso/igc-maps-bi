from flask import Flask, render_template,request, session
import pandas as pd

app = Flask(__name__) #create app instance
app.secret_key = 'example' #store this in an environment variable for live apps.
filepath = 'input/'
#read in data
data = pd.read_csv('data/llamadas_bta.csv',sep=';')

#homepage
@app.route("/", methods = ['GET','POST'])
def H2H():
    #set default form values
    if request.form.get("localidad_select") == None:
        localidad = 'USME'
    else:
        localidad =request.form.get("localidad_select")

    data = pd.read_csv('data/llamadas_bta.csv',sep=';')
    localidad_list =  data.LOCALIDAD.unique()
    session['localidad_serv'] = localidad
    return render_template("index.html",localidad_serv = localidad, localidad_list=localidad_list)

@app.route("/data")
def get_data():
    localidad_serv = [session.get('localidad_serv', None)]
    print(localidad_serv)
    df = data[(data.LOCALIDAD == localidad_serv[0])]
    print(len(df))
    return df.to_json(orient='records')

@app.route("/formData")
def get_team_data():
    localidad_serv = [session.get('localidad_serv', None)]
    df = data[(data.LOCALIDAD == localidad_serv[0]) ]
    return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
