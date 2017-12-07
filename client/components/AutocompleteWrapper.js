import React from "react";
import Autocomplete from './Autocomplete'
import makeAsyncScriptLoader from "react-async-script";

const URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAopJDwUG1vlrsZg94qP6yuPtzapUgYw8g&libraries=places'

export default makeAsyncScriptLoader(Autocomplete, URL);