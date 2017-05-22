import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import t from 'tcomb-form'
import templates from 'tcomb-form-templates-bootstrap-4'


t.form.Form.templates = templates
const FormSchema = t.struct({
  name: t.String,         // a required string
  age: t.maybe(t.Number), // an optional number
  rememberMe: t.Boolean   // a boolean
})
const Int = t.refinement(t.Number, (n) => n % 1 == 0);

class FeatureEditor extends Component {
  state = {}
  onSubmit  (evt)  {
    evt.preventDefault()
    console.log('kk');
    const value = this.form.getValue()
    if (value) {
      console.log(value)
    }
  }
  componentDidMount(){
    const {geoserverUrl, typeName} = this.props;
    var url = geoserverUrl;
    url += "wfs?service=wfs&request=DescribeFeatureType&version=2.0.0&outputFormat=application/json";
    url += `&featureTypes=${typeName}`;

    fetch(url, {
      credentials: 'include',
    }).then(res=>res.json()).then((res) => {
      const layerName = typeName.split(":").pop();
      var featureType =   res.featureTypes.find(fType => fType.typeName == layerName)
      console.log(featureType);
      const schema = {};
      featureType.properties.forEach(attribute => {
        if(attribute.type == "xsd:string"){
          schema[attribute.name] = t.String
        } else if(attribute.type == "xsd:int"){
          schema[attribute.name] = Int
        }

        if(attribute.nillable && schema[attribute.name]){
          schema[attribute.name] = t.maybe(schema[attribute.name])
        }

      });
      this.setState({formSchema: t.struct(schema)})
    });
  }
  render(){
    const {fid, typeName} = this.props;
    const {formSchema} = this.state;
    if(!formSchema) return null;

    return <div>
      <h1>{typeName}</h1>
      <h2>{fid && `Edit ${fid}` }</h2>
      <h2>{!fid && 'Add'}</h2>

        <form onSubmit={this.onSubmit.bind(this)}>
          <t.form.Form ref={f => this.form = f} type={formSchema} />
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
    </div>
  }
}



global.FeatureEditor = FeatureEditor;
global.React = React;
global.ReactDOM = ReactDOM;
export default FeatureEditor;
