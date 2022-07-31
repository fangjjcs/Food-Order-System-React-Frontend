
import { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';

import AgTable from '../widget/AgTable';
import { useSelector } from 'react-redux';

const defaultColumns = [
    "id", "name", "max_time", "min_time"
]

const getColumns = (data) => {
    const set = new Set(defaultColumns);
    for(let i = 0 ; i < data.length ; i ++ ){
        for (const [key, value] of Object.entries(data[i])) {
            if(!set.has(key)){
                set.add(key)
            }
        }
    }
    return [...set]
}

const convertJsonToTable = (data) => {
    const longestColumns = getColumns(data);
    const copiedData = deepCopy(data);
    for(let i = 0 ; i < copiedData.length ; i ++ ){
        for(let attr = 0 ; attr < longestColumns.length ; attr++){
            if(!copiedData[i][longestColumns[attr]]){
                copiedData[i][longestColumns[attr]] = 'undefined'
            } else {
                continue
            }
        }
    }

    return copiedData
}

const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data));
}

const LevelOneTab = () => {

    const [value, setValue] = useState(0);

    const unitData = useSelector( state => state.edit.data.UNITS.unit);
    const [tableData, setTableData] = useState([]);

    useEffect(()=>{
        console.log("store data has changed!", unitData)
        setTableData(convertJsonToTable(unitData))
    },[unitData])

    useEffect(()=>{
        console.log("table data has changed!", tableData)
    },[tableData])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    return(
        <div className='tab-box'>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} >
                <AgTable data={tableData} defaultColumns={defaultColumns}/>
            </TabPanel>
            <TabPanel value={value} index={1} >
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2} >
                Item Three
            </TabPanel>
        </div>
    )

}

export default LevelOneTab;