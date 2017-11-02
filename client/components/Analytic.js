import React, {Component} from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar} from 'recharts';
import randomColor from 'randomcolor';
import axios from 'axios';

export default class Analytic extends Component {
    constructor(){
        super();
        this.state = {
            data: [
            ]
        }
    }

    componentDidMount(){
        axios.get('/api/products')
            .then(res => res.data)
            .then(products => {
                let data = [],
                    period = {
                        name: 'Total Order Placed To Date'
                    };
                products.forEach(product => {
                    period[product.name] = product.lineitems.length;
                });
                data.push(period);
                this.setState({data});
            })
    }

    render(){
        const {data} = this.state;
        console.log("data is ", data)
        let seed = 0;
        return (
            <BarChart width={730} height={250} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              {

                data.map(period => {
                    return Object.keys(period).map(key => {
                        if (key !== 'name') {
                            seed += 10;
                            console.log(`<Bar dataKey=${key} fill=${randomColor({seed, hue: 'blue'})} />`)
                            return (
                                <Bar dataKey={key} fill={randomColor({seed})} />
                            )
                        }
                    })
                })
              }
            </BarChart>
        )
    }
}
