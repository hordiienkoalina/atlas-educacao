(this["webpackJsonpatlas-educacao"]=this["webpackJsonpatlas-educacao"]||[]).push([[0],{10:function(e,t,a){e.exports=a(60)},50:function(e,t,a){},51:function(e,t,a){},52:function(e,t,a){},54:function(e,t,a){},55:function(e,t,a){},56:function(e,t,a){},57:function(e,t,a){},58:function(e,t,a){},59:function(e,t,a){},60:function(e,t,a){"use strict";a.r(t);var o=a(0),l=a.n(o),r=a(8),i=a(1),n=a.n(i),c=a(9),s=a.n(c);a(50);var p=function(e){let{onButtonClick:t,onLayerChange:a}=e;const[r,i]=Object(o.useState)("Access-Quality"),n=e=>{i(e),t(e)};return l.a.createElement("div",{className:"overlay-buttons"},l.a.createElement("button",{className:"overlay-button "+("Access-Quality"===r?"active":""),onClick:()=>n("Access-Quality")},"Access-Quality"),l.a.createElement("button",{className:"overlay-button "+("Quality"===r?"active":""),onClick:()=>n("Quality")},"Quality"),l.a.createElement("button",{className:"overlay-button "+("Access"===r?"active":""),onClick:()=>n("Access")},"Access"),l.a.createElement("button",{className:"overlay-button "+("Income"===r?"active":""),onClick:()=>n("Income")},"Income"),l.a.createElement("button",{className:"overlay-button "+("Gender"===r?"active":""),onClick:()=>n("Gender")},"Gender"),l.a.createElement("button",{className:"overlay-button "+("Race"===r?"active":""),onClick:()=>n("Race")},"Race"))};a(51);var d=e=>{let{colors:t,labels:a}=e;const o=`linear-gradient(to right, ${(Array.isArray(t)?t.filter(e=>"string"===typeof e&&e.startsWith("#")):[]).join(", ")})`;return console.log("Generated gradient:",o),l.a.createElement("div",{className:"legend-container"},l.a.createElement("div",{className:"legend-scale",style:{background:o}}),l.a.createElement("div",{className:"legend-labels"},a.map((e,t)=>l.a.createElement("span",{key:t},e))))};a(52),a(53);n.a.accessToken="pk.eyJ1IjoiZmVsaXBlaGx2byIsImEiOiJjbDNpNTRpMjkwMHJvM2JvOHZnZGdxNnR5In0.4OfuGp1nCZ0t_ugV7NQZng";class h extends o.Component{constructor(e){super(e),this.addMapControls=e=>{e.addControl(new n.a.NavigationControl,"top-left");const t=new s.a({accessToken:n.a.accessToken,mapboxgl:n.a,countries:"br",placeholder:"Search",zoom:10,marker:!1});t.on("result",t=>{e.flyTo({center:t.result.center,zoom:10})}),e.addControl(t,"top-right")},this.addMapClickHandler=e=>{e.on("click","brazil-microregion-layer",e=>{console.log("Microregion layer clicked"),this.handleMapClick(e)}),e.on("click","brazil-municipality-layer",e=>{console.log("Municipality layer clicked"),this.handleMapClick(e)}),e.on("click","brazil-point-layer",e=>{console.log("Point layer clicked"),this.handleMapClick(e)}),e.on("click","brazil-polygon-layer-1",e=>{console.log("Polygon layer clicked"),this.handleMapClick(e)}),e.on("click","brazil-polygon-layer-2",e=>{console.log("Polygon layer clicked"),this.handleMapClick(e)})},this.handleMapClick=e=>{const{activeVariable:t,colorScales:a}=this.state,o=e.lngLat,l=e.features[0].properties;console.log("Active variable:",t),console.log("Properties of clicked feature:",l);let r='<div class="popup-container"><div style="flex: 1;">';if("majority_race"===t){const e=[{name:"White",percentage:l.pct_white,colorClass:"progress-bar-white"},{name:"Black",percentage:l.pct_black,colorClass:"progress-bar-black"},{name:"Indigenous",percentage:l.pct_indigenous,colorClass:"progress-bar-indigenous"},{name:"Asian",percentage:l.pct_asian,colorClass:"progress-bar-asian"},{name:"Parda",percentage:l.pct_pardos,colorClass:"progress-bar-pardos"}];e.sort((e,t)=>(t.percentage||0)-(e.percentage||0)),e.forEach(e=>{const t=void 0!==e.percentage?(100*e.percentage).toFixed(1):"Data Unavailable";r+=`\n          <p style="margin: 0; line-height: 2; color: #000;">${t}%<strong> ${e.name}</strong> </p>\n          <div class="progress-container">\n            <div class="progress-bar ${e.colorClass}" style="width: ${100*e.percentage}%;"></div>\n          </div>\n        `}),r+='<div style="height: 5px;"></div>\n      <div class="line-divider"></div>'}else if("pct_men_percentile"===t){const e=void 0!==l.pct_men?(100*l.pct_men).toFixed(1):"Data Unavailable",t=1-l.pct_men!==void 0?(100*[1-l.pct_men]).toFixed(1):"Data Unavailable";r+=`\n        <p style="margin: 0; line-height: 2; color: #000;">${e}%<strong> Male</strong></p>\n        <div class="progress-container">\n          <div class="progress-bar progress-bar-male" style="width: ${100*l.pct_men}%;"></div>\n        </div>\n        <p style="margin: 0; line-height: 2; color: #000;">${t}%<strong> Female</strong> </p>\n        <div class="progress-container">\n          <div class="progress-bar progress-bar-female" style="width: ${100*[1-l.pct_men]}%;"></div>\n        </div>\n        <div style="height: 5px;"></div>\n        <div class="line-divider"></div>\n      `}const i=l.name_state,c=l.state_id||l.abbrev_state,s=l.city_name||l.name_muni||l.code_muni,p=l.sector_id,d=this.formatNumber(l.avg_monthly_earnings),h=this.formatNumber(l.avg_monthly_earnings_dollars),u=this.formatNumber(l.n_people_15to17);if("pct_men_percentile"!==t&&"majority_race"!==t){const e=l[t];if(void 0===e||isNaN(e))r+='<strong style="font-size: 16px; line-height: 2">Data Unavailable</strong>',r+='<div class="line-divider"></div>';else{const e=l[t],o=Math.round(100*e),i={A_percentile:"Access",Q_percentile:"Quality",H_percentile:"Access-Quality",P_percentile:"Population",avg_monthly_earnings_percentile:"Income",pct_men_percentile:"Gender",majority_race:"Race"}[t],n=this.getColorForValue(a[t],e),c=(e=>{if(e>10&&e<20)return e+"th";switch(e%10){case 1:return e+"st";case 2:return e+"nd";case 3:return e+"rd";default:return e+"th"}})(o);r+=`<span class="color-box" style="background-color: ${n};"></span>`,r+=`<strong class="percentile-text">${c}</strong> <span class="percentile-text">${i} Percentile</span>`,r+='<div class="line-divider"></div>'}}p&&(r+=`<p style="margin: 0px; line-height: 2;">Tract <strong>${p}</strong></p>`);const g=[s,i?`${i} (${c})`:null].filter(Boolean).join(", ");g&&(r+=`<p style="margin: 0; line-height: 2;"><em>${g}</em></p>`),u&&(r+=`<p style="margin: 0; line-height: 2;"><strong># of Schoolchildren:</strong> ${u}</p>`),d&&(r+=`<p style="margin: 0; line-height: 2;"><strong>Avg Monthly Income:</strong> R$${d} \u2248 US$${h}</p>`),r+="</div></div>",this.state.popup&&this.state.popup.remove();const m=new n.a.Popup({closeButton:!1}).setLngLat(o).setHTML(r).addTo(this.state.map);this.state.selectedFeature&&this.state.selectedFeature.id===e.features[0].id?this.setState({selectedFeature:null,popup:null},()=>{this.removeHighlight(),m.remove()}):this.setState({selectedFeature:e.features[0],popup:m},()=>{this.highlightFeature()})},this.formatNumber=e=>null==e?"Data Unavailable":Math.round(e).toLocaleString(),this.getColorForValue=(e,t)=>{if(!Array.isArray(e)||e.length<6)return console.error("Invalid color scale format",e),"#000000";const a=[{stop:0,color:e[4]},{stop:.25,color:e[6]},{stop:.5,color:e[8]},{stop:.75,color:e[10]},{stop:1,color:e[12]}];console.log("stops:",a);for(let o=0;o<a.length-1;o++)if(console.log(`Checking if ${t} is between ${a[o].stop} and ${a[o+1].stop}`),t>=a[o].stop&&t<=a[o+1].stop){const e=(t-a[o].stop)/(a[o+1].stop-a[o].stop),l=this.interpolateColor(a[o].color,a[o+1].color,e);return console.log("Interpolating between",a[o].color,"and",a[o+1].color,"with factor",e,"result:",l),l}return console.warn("Value out of range, using last color",a[a.length-1].color),a[a.length-1].color},this.interpolateColor=(e,t,a)=>{const o=this.hexToRgb(e),l=this.hexToRgb(t),r={r:Math.round(o.r+a*(l.r-o.r)),g:Math.round(o.g+a*(l.g-o.g)),b:Math.round(o.b+a*(l.b-o.b))};return this.rgbToHex(r)},this.hexToRgb=e=>{if("string"!==typeof e)return console.error("Invalid hex color format",e),{r:0,g:0,b:0};const t=parseInt(e.slice(1),16);return{r:t>>16&255,g:t>>8&255,b:255&t}},this.rgbToHex=e=>"#"+((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1).toUpperCase(),this.highlightFeature=()=>{const{map:e,selectedFeature:t}=this.state;if(e.getSource("highlight-source")||(e.addSource("highlight-source",{type:"geojson",data:{type:"FeatureCollection",features:[]}}),e.addLayer({id:"highlight-layer",type:"line",source:"highlight-source",paint:{"line-color":"#000000","line-width":2}})),t){const a={type:"FeatureCollection",features:[t]};e.getSource("highlight-source").setData(a)}},this.removeHighlight=()=>{const{map:e}=this.state,t={type:"FeatureCollection",features:[]};e.getSource("highlight-source")&&e.getSource("highlight-source").setData(t)},this.initializeColorScales=()=>{const e={H_percentile:["#e8d893","#b8d993","#40b5c4","#2567ad","#152774"],Q_percentile:["#f9b9c3","#ee89ae","#d41ac0","#78106d","#49006a"],A_percentile:["#ece99d","#b4c689","#87b034","#11692b","#263021"],P_percentile:["#f7fcb9","#addd8e","#31a354","#006837","#004529"],avg_monthly_earnings_percentile:["#fff9c7","#f7cd86","#fec561","#da5b09","#8a3006"],pct_men_percentile:["#d41ac0","#e1a7be","#fbf4ff","#8caac2","#083d7f"],majority_race:["#3babfb","#7ce35c","#c9d662","#366d7b","#cd5468"]},t={A_percentile:[0,.25,.5,.75,1],Q_percentile:[0,.25,.5,.75,1],H_percentile:[0,.25,.5,.75,1],P_percentile:[0,.25,.5,.75,1],avg_monthly_earnings_percentile:[0,.25,.5,.75,1],pct_men_percentile:[0,.25,.5,.75,1],majority_race:[0,.25,.5,.75,1]};let a={};return Object.keys(e).forEach(o=>{a[o]=this.createColorScale(o,e[o],t[o])}),console.log("Initialized color scales:",a),a},this.createColorScale=(e,t,a)=>{const o=["interpolate",["linear"],["get",e],a[0],t[0],a[1],t[1],a[2],t[2],a[3],t[3],a[4],t[4]];return console.log(`Color scale for ${e}:`,o),o},this.initializeMapLayers=()=>{const e=this.state.map;n.a.clearStorage(),this.addMapSourcesAndLayers(e)},this.addMapSourcesAndLayers=e=>{e.addSource("brazil-state-data",{type:"vector",url:"mapbox://felipehlvo.access-data-state-source"}),e.addSource("brazil-microregion-data",{type:"vector",url:"mapbox://felipehlvo.bdpj1vs3"}),e.addSource("brazil-municipality-data",{type:"vector",url:"mapbox://felipehlvo.8teeogrv"}),e.addSource("brazil-point-data",{type:"vector",url:"mapbox://felipehlvo.0ix28ugv"}),e.addSource("brazil-polygon-data-1",{type:"vector",url:"mapbox://felipehlvo.37gudv8r"}),e.addSource("brazil-polygon-data-2",{type:"vector",url:"mapbox://felipehlvo.20fz2p7e"}),this.setupMapLayers(e)},this.setupMapLayers=e=>{const{colorScales:t,activeVariable:a}=this.state;e.addLayer({id:"brazil-state-border",type:"line",source:"brazil-state-data","source-layer":"state-layer-tileset",layout:{},paint:{"line-color":"#000000","line-width":1.5}},this.getFirstSymbolLayerId(e)),e.addLayer({id:"brazil-microregion-layer",type:"fill",source:"brazil-microregion-data","source-layer":"access_data_microregion-85x9oi",minzoom:this.zoomThreshold-1,maxzoom:this.zoomThreshold+1,layout:{},paint:{"fill-color":t[a],"fill-opacity":1}},"brazil-state-border"),e.addLayer({id:"brazil-municipality-layer",type:"fill",source:"brazil-municipality-data","source-layer":"access_data_municipality-9h9prk",minzoom:this.zoomThreshold,maxzoom:this.zoomThreshold+3,layout:{},paint:{"fill-color":t[a],"fill-opacity":1}},"brazil-microregion-layer"),e.addLayer({id:"brazil-point-layer",type:"circle",source:"brazil-point-data","source-layer":"access_data_points-4ck2j5",minzoom:this.zoomThreshold+3,paint:{"circle-color":t[a],"circle-radius":["interpolate",["linear"],["zoom"],8,1.5,13,5],"circle-blur":["interpolate",["linear"],["zoom"],8,1,13,0],"circle-opacity":.75}},this.getFirstLineLayerId(e)),e.addLayer({id:"brazil-polygon-layer-1",type:"fill",source:"brazil-polygon-data-1","source-layer":"access_data_polygons_1-0bkwx1",minzoom:this.zoomThreshold+3,layout:{},paint:{"fill-color":t[a],"fill-opacity":.2}},"brazil-municipality-layer"),e.addLayer({id:"brazil-polygon-layer-2",type:"fill",source:"brazil-polygon-data-2","source-layer":"access_data_polygons_2-92243f",minzoom:this.zoomThreshold+3,layout:{},paint:{"fill-color":t[a],"fill-opacity":.2}},"brazil-municipality-layer")},this.getFirstSymbolLayerId=e=>{const t=e.getStyle().layers;for(let a=0;a<t.length;a++)if("symbol"===t[a].type)return t[a].id},this.getFirstLineLayerId=e=>{const t=e.getStyle().layers;for(let a=0;a<t.length;a++)if("line"===t[a].type)return t[a].id},this.updateMapLayers=()=>{const{map:e,colorScales:t,activeVariable:a}=this.state;if(!e)return;console.log("Updating map layers for activeVariable:",a),console.log("Color scale being applied:",t[a]);const o={"brazil-microregion-layer":"fill-color","brazil-municipality-layer":"fill-color","brazil-point-layer":"circle-color","brazil-polygon-layer-1":"fill-color","brazil-polygon-layer-2":"fill-color"},l="#08519c",r="#006d2c",i="#bea40d",n="#62367b",c="#a50f15";Object.keys(o).forEach(s=>{if(e.getLayer(s)){const p=t[a];"majority_race"===a?(console.log("Setting color scale for majority race layer"),e.setPaintProperty(s,o[s],["interpolate",["linear"],["get","majority_percentage"],0,"#ffffff",1,["match",["get","majority_race"],"n_people_15to17_white",l,"n_people_15to17_black",r,"n_people_15to17_indigenous",i,"n_people_15to17_asian",n,"n_people_15to17_parda",c,"#ccc"]])):p?(console.log("Setting color scale for layer "+s),e.setPaintProperty(s,o[s],p)):console.error(`Color scale for ${a} is not defined`)}})},this.handleButtonClick=e=>{const t={Access:"A_percentile",Quality:"Q_percentile","Access-Quality":"H_percentile",Population:"P_percentile",Income:"avg_monthly_earnings_percentile",Gender:"pct_men_percentile",Race:"majority_race"}[e],a={A_percentile:["Poor","Adequate"],Q_percentile:["Poor","Adequate"],H_percentile:["Poor","Adequate"],P_percentile:["Sparse","Dense"],avg_monthly_earnings_percentile:["Low","High"],pct_men_percentile:["Female","Male"],majority_race:["White","Black","Indigenous","Asian","Parda"]}[t];this.setState({activeVariable:t,colors:this.initializeColorScales()[t],labels:a}),this.props.onLayerChange(e)},this.state={map:null,activeVariable:"H_percentile",colorScales:this.initializeColorScales(),colors:this.initializeColorScales().H_percentile,labels:["Scarce","Adequate"],selectedFeature:null,popup:null},this.mapContainer=l.a.createRef(),this.zoomThreshold=5}componentDidMount(){const e=new n.a.Map({container:this.mapContainer.current,style:"mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs",center:[-46.63,-23.6],zoom:7,minZoom:5,maxZoom:12,maxBounds:[[-74.5,-33.5],[-34.5,5.5]]});e.on("load",()=>{this.setState({map:e},()=>{this.initializeMapLayers(),this.addMapControls(e),this.addMapClickHandler(e),console.log("Map has loaded."),console.log("Current map style:",e.getStyle()),console.log("Current zoom level:",e.getZoom())})})}componentDidUpdate(e,t){t.activeVariable!==this.state.activeVariable&&(console.log("Active variable changed from",t.activeVariable,"to",this.state.activeVariable),this.updateMapLayers())}render(){const{colors:e,labels:t}=this.state;return l.a.createElement("div",{className:"map-wrapper"},l.a.createElement("div",{ref:this.mapContainer,className:"map-container",style:{height:"calc(100vh - 100px)"}})," ",l.a.createElement(p,{onButtonClick:this.handleButtonClick,onLayerChange:this.props.onLayerChange}),l.a.createElement(d,{colors:e,labels:t})," ")}}var u=h;a(54);var g=function(){return l.a.createElement("footer",{className:"footer-menu"},l.a.createElement("a",{href:"https://github.com/hordiienkoalina/access-to-education",target:"_blank",rel:"noopener noreferrer"},l.a.createElement("i",{className:"fab fa-github"})," "),l.a.createElement("span",{className:"divider"},"|")," ",l.a.createElement("a",{href:"https://drive.google.com/file/d/1XcylVaGVecnlIRGluxcbrwDkYOeJ9owh/view?usp=sharing",target:"_blank",rel:"noopener noreferrer"},"Methodology"),l.a.createElement("span",{className:"divider"},"|")," ",l.a.createElement("a",{href:"https://drive.google.com/drive/folders/1mLUgjvGivuuT-pvkGqEP_5QEk8fQOyJq?usp=sharing",target:"_blank",rel:"noopener noreferrer"},"Download Data"))};a(55);var m=()=>l.a.createElement("header",{className:"header"},l.a.createElement("div",{className:"header-content"},l.a.createElement("h1",null,"Atlas Educa\xe7\xe3o")));a(56);var y=e=>{let{title:t,description:a}=e;return l.a.createElement("div",{className:"subheader"}," ",l.a.createElement("h2",null,t)," ",l.a.createElement("p",null,a)," ")};a(57);var b=e=>{let{onClose:t}=e;const[a,r]=Object(o.useState)(!1);return l.a.createElement("div",{className:"popup-overlay"},l.a.createElement("div",{className:"popup-content"},l.a.createElement("button",{className:"popup-close",onClick:()=>{a&&localStorage.setItem("popupClosed","true"),t()}},"\xd7"),l.a.createElement("h2",null,"Welcome to Atlas Educa\xe7\xe3o"),l.a.createElement("p",null,"Access to education is commonly associated with the cost and proximity of a school. While these are crucial factors, other elements like resource availability, classroom capacity, and education quality are equally pivotal. "),l.a.createElement("p",null," The Atlas Educa\xe7\xe3o uses the Demographic Census and the School Census to highlight which areas have inadequate access to public secondary education. Use the map to explore every neighborhood in Brazil to see which have the most and the least access to high-quality public high schools."),l.a.createElement("div",null,l.a.createElement("input",{type:"checkbox",id:"dont-show-again",onChange:e=>{r(e.target.checked)}}),l.a.createElement("label",{htmlFor:"dont-show-again"},"Don't show this again"))))};a(58);var v=()=>{const[e,t]=Object(o.useState)("Access-Quality"),[a,r]=Object(o.useState)(!1);return Object(o.useEffect)(()=>{localStorage.getItem("popupClosed")||r(!0)},[]),l.a.createElement("div",{className:"App"},l.a.createElement(m,null),l.a.createElement("div",{className:"content"},l.a.createElement(y,{title:""+e,description:{Access:"The spatial access to public high schools, considering supply and demand of schools and student preferences.",Quality:"The quality of each school based on test scores and grade progression ratios.","Access-Quality":"The spatial access to high-quality public high schools, considering supply and demand of schools, student preferences, and school quality.",Income:"The monthly household earnings.",Gender:"The gender distribution of the population.",Race:"The racial distribution of the population."}[e]||"No description available."}),l.a.createElement("div",{className:"map-container"},l.a.createElement(u,{onLayerChange:e=>{t(e)}}))),l.a.createElement(g,null),a&&l.a.createElement(b,{onClose:()=>{r(!1)}})," ")};a(59);const f=document.getElementById("root");Object(r.createRoot)(f).render(l.a.createElement(v,null))}},[[10,1,2]]]);
//# sourceMappingURL=main.e8a285d0.chunk.js.map