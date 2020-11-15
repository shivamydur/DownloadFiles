import React from 'react';
import ReactDOM from 'react-dom';

import Checkbox from '../forms/Checkbox';

import './Download.css'
import downloadImg from './../assets/img/download.png';
import availableImg from './../assets/img/available.png';
import scheduledImg from './../assets/img/scheduled.png';

class Download extends React.Component {
    
    //
    // Function: constructor
    // param: props - Files list is passed from parent component
    // Description: called during component initialization with props passed from parent componet
    //
    constructor(props) {
        super(props);

        this.checkboxRef = React.createRef();
        let totalFiles = 0;
        this.props.files.map((file, index) => {
            totalFiles++;
        });

        this.state = {
            checkedItems: new Map(),
            cbSelected: false,
            totalChecked: 0,
            totalFiles: totalFiles
        }
    }

    //
    // Function: handleTableCheckBox
    // param: e: event 
    // Description: on selected checkbox, check All or diselected files checkboxes
    //
    handleTableCheckBox(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;

        let tempTotalChecked = this.state.totalChecked;

        if (isChecked) {
            tempTotalChecked++;
            this.setState((prevState) => ({
                checkedItems: prevState.checkedItems.set(item, isChecked),
                totalChecked: prevState.totalChecked + 1
            }));
                
        } else {
            tempTotalChecked--;
            this.setState((prevState) => ({
                checkedItems: prevState.checkedItems.set(item, isChecked),
                totalChecked: prevState.totalChecked - 1
            }));
        }

        if (tempTotalChecked > 0 && tempTotalChecked < this.state.totalFiles) {
            ReactDOM.findDOMNode(this.checkboxRef.current).indeterminate = true;
        } else if (tempTotalChecked === this.state.totalFiles) {
            ReactDOM.findDOMNode(this.checkboxRef.current).indeterminate = false;
            this.setState({cbSelected: true});
        } else {
            ReactDOM.findDOMNode(this.checkboxRef.current).indeterminate = false;
            this.setState({cbSelected: false});
        }
    }
    
    //
    // Function: handleSelectedCheckBox
    // param: e: event 
    // Description: on selected checkbox, check All or diselected files checkboxes
    //
    handleSelectedCheckBox (e) {
        const item = e.target.name;
        const isChecked = e.target.checked;

        if (isChecked) {
            let checkedItems = new Map();
            this.props.files.map((file, index) => {
                checkedItems.set(''+index, true);
            });
            this.setState({cbSelected: isChecked, checkedItems: checkedItems, totalChecked: checkedItems.size});
        } else {
            let checkedItems = new Map();
            this.props.files.map((file, index) => {
                checkedItems.set(''+index, false);
            });
            this.setState({cbSelected: isChecked, checkedItems: checkedItems, totalChecked: 0});
        }
    }

    //
    // Function: handleDownloadSelected
    // param: e: event 
    // Description: display selected items in alert dialog
    //
    handleDownloadSelected(e) {
        if (this.state.totalChecked <= 0) {
            return;
        }

        let strMsg = "Downloading selcted file \r\r";
        this.state.checkedItems.forEach((v, k) => {
            if (v == true) {
                strMsg += 'Device: ' + this.props.files[+k].device + "\r";
                strMsg += 'Path: ' + this.props.files[+k].path + "\r\r";
                console.log('strMsg: ', strMsg);
            }
        } )
        alert(strMsg);
    }

    //
    // Function: render
    // param: none
    // Description: React's render method called as life cycle when component mounted, updated, or state changed
    //
    render () {
        const filesList = this.props.files.map((file, index) => {
            let rowBgColor = this.state.checkedItems.get(''+index) == true ? "selectedRowColor" : "" ;
            let sttausImg = file.status === "available" ? availableImg : scheduledImg;
            return (
                <tr key={index} className={rowBgColor} ><td>
                    <Checkbox name={''+index}
                        checked={false}
                        checked={this.state.checkedItems.get(''+index)}
                        onChange={(event) => {
                            this.handleTableCheckBox(event);
                        }}
                    />
                    </td>
                    <td>{file.name}</td>
                    <td>{file.device}</td>
                    <td>{file.path}</td>
                    <td><img style={{verticalAlign: "bottom"}} src={sttausImg} width="20" height="20"/>&nbsp;{ file.status.charAt(0).toUpperCase() + file.status.slice(1) }</td>
                </tr>
            )
        })

        let selectedMsg = this.state.totalChecked > 0 ? "Selected: " + this.state.totalChecked : "None Selected";
        let btnDownload = this.state.totalChecked > 0 ? "btnActive" : "btnDim";
        return  (
            <div>
                <div className="container">
                    <div className="header">
                        <span style={{marginRight: 16}}>
                        <Checkbox name="cbHeader"
                            checked={false}
                            checked={this.state.cbSelected}
                            refObj={this.checkboxRef}
                            onChange={(event) => { this.handleSelectedCheckBox(event); }}
                        />
                        </span>
                        <span style={{marginLeft: 10}}>{selectedMsg}</span>
                        <span style={{marginLeft: 50, color: '#585858', }} className={btnDownload} onClick={(event) => { this.handleDownloadSelected(event)}}>
                            <img style={{verticalAlign: "bottom"}} src={downloadImg} width="24" height="24" alt="Download Files..." />&nbsp;Download Selected
                        </span>
                    </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th style={{width:'3%'}}>&nbsp;</th>
                        <th style={{width:'14%'}}>Name</th>
                        <th style={{width:'14%'}}>Device</th>
                        <th style={{width:'55%'}}>Path</th>
                        <th style={{width:'25%'}}>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        { filesList }
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

export default Download;
