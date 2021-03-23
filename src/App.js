import React, {useState, useEffect} from 'react';
import './App.css';
import {forwardRef} from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'
import $ from "jquery";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

const api = axios.create({
    baseURL: `http://localhost:8000`
    //baseURL: `https://reqres.in/api`
})


function validateEmail(email) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

$(document).ready(function () {

    $(".close_appointment").click(function () {
        $(".GreenAdd").css("display", "none");
    });
    $(".close_appointment").click(function () {
        $(".RedAdd").css("display", "none");
    });
    $(".close_appointment").click(function () {
        $(".YellowAdd").css("display", "none");
    });

});

function App() {

    let columns = [
        //{title: "id", field: "id", hidden: false},
        {
            title: "Avatar",
            render: rowData => <Avatar maxInitials={2} size={40} round={true} id={rowData === undefined ? " " : rowData.id} name={rowData === undefined ? " " : rowData.firstname + rowData.lastname}/>
        },
        {title: "First Name", field: "firstname"},
        {title: "Last Name", field: "lastname"},
        {title: "Phone", field: "phone"},
        {title: "Email", field: "email"},
        {title: "Birthdate", field: "birthdate"},
    ]

    // set states data
    const [data, setData] = useState([]); //table data
    const [patiendata, setModalData] = useState([]); //table data
    const [patientappointmentdata, setPatientModalData] = useState([]); //table data

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    // get patient data
    useEffect(() => {
        api.get("/getpatients?username=username9876324&password=PWD9876324&token=98763249876324")
            .then(res => {
                setData(res.data.data)
                console.log(res.data.data)
            })
            .catch(error => {
                console.log("Error")
            })
    }, [])

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = []
        if (newData.first_name === "") {
            errorList.push("Please enter first name")
        }
        if (newData.last_name === "") {
            errorList.push("Please enter last name")
        }
        if (newData.email === "" || validateEmail(newData.email) === false) {
            errorList.push("Please enter a valid email")
        }

        if (errorList.length < 1) {
            api.patch("username=username9876324&password=PWD9876324&token=98763249876324&firstname=" + newData.firstname + "lastname=" + newData.lastname)
                .then(res => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve()
                    setIserror(false)
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    setIserror(true)
                    resolve()

                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()

        }

    }

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        if (newData.first_name === undefined) {
            errorList.push("Please enter first name")
        }
        if (newData.last_name === undefined) {
            errorList.push("Please enter last name")
        }
        if (newData.email === undefined || validateEmail(newData.email) === false) {
            errorList.push("Please enter a valid email")
        }

        if (errorList.length < 1) { //no error
            api.post("username=username9876324&password=PWD9876324&token=98763249876324&&firstname=" + newData.firstname + "lastname=" + newData.lastname)
                .then(res => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve()
                    setErrorMessages([])
                    setIserror(false)
                })
                .catch(error => {
                    setErrorMessages(["Cannot add data. Server error!"])
                    setIserror(true)
                    resolve()
                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }


    }

    const handleRowDelete = (oldData, resolve) => {

        api.delete("/username=username9876324&password=PWD9876324&token=98763249876324&id=" + oldData.id)
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve()
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
                setIserror(true)
                resolve()
            })
    }


    const onRowClick = (rowData) => {

        console.log(rowData);
        // get modal patient info
        api.get("/getmodalpatientinfo?username=username9876324&password=PWD9876324&token=98763249876324&firstname=" + rowData.firstname + "&lastname=" + rowData.lastname)
            .then(res => {
                console.log("    patientInfoModalData  data")
                console.log(res.data.data)
                setModalData(res.data.data)
            })
            .catch(error => {
                console.log("Error")
            })

        // get modal patient appoint recs
        api.get("/getmodalpatientsappointments?username=username9876324&password=PWD9876324&token=98763249876324&firstname=" + rowData.firstname + "&lastname=" + rowData.lastname)
            .then(res => {
                console.log("patientAppointmentModalData data")
                console.log(res.data.data)
                setPatientModalData(res.data.data)
            })
            .catch(error => {
                console.log("Error")
            })

    }


    return (

        //  TABLE
        <div className="App">
            <div className="headerWrapper">Medical Practice ABC</div>
            <div className="tableMaindiv">
                <Grid container spacing={1}>

                    <Grid item xs={1}></Grid>

                    <Grid item xs={12}>
                        <div>
                            {iserror &&
                            <Alert severity="error">
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>
                                })}
                            </Alert>
                            }
                        </div>

                      
                        <MaterialTable
                            title="Patients & Appointments"
                            columns={columns}
                            data={data}
                            icons={tableIcons}

                            onRowClick={(event, rowData) => {
                                //console.log("rowData")
                                console.log(rowData)

                                onRowClick(rowData)
                                $(".RedAdd").css("display", "block");

                            }}


                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve) => {
                                        handleRowUpdate(newData, oldData, resolve);

                                    }),
                                onRowAdd: (newData) =>
                                    new Promise((resolve) => {
                                        handleRowAdd(newData, resolve)
                                    }),
                                onRowDelete: (oldData) =>
                                    new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
                                    }),
                            }}
                        />
                    </Grid>

                    <Grid item xs={2}></Grid>

                </Grid>
            </div>


            {/*MODAL */}
            <div className="RedAdd" style={{display: 'none'}}>
                <div className="back_bg_color"></div>
                <div className="appointment_main">
                    <span className="close_appointment">X</span>

                    {/*loop on usermodaldata*/}


                    {Object.keys(patiendata).map(function (key) {

                        return (
                            <div className="popup_header">

                                <div className="right_side_head">
                                    <span className="profile-big-img-red">{patiendata[key].initials}</span>
                                </div>
                                <div className="left_side_head">
                                    <div className="first_line_header">{patiendata[key].firstname} {patiendata[key].lastname}</div>
                                    <div className="date">{patiendata[key].birthdate}</div>
                                    <div className="phone">{patiendata[key].phone}</div>
                                </div>

                            </div>

                        )
                    })}


                    {/* appointment infor*/}
                    <div className="popup_body">

                        <ul>

                            {/*loop on patientappointmentdata*/}

                            {Object.keys(patientappointmentdata).map(function (key) {
                                return (
                                    <li className="pop-up-li-common">
                                        <div className="date_and_time">{patientappointmentdata[key].startdate} {patientappointmentdata[key].starttime}</div>
                                        <div className="subheading">{patientappointmentdata[key].title}</div>
                                    </li>

                                )
                            })}


                        </ul>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default App;
