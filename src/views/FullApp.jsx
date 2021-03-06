// React Imports:
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
// Material UI components:
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// Application components:
import NavBar from '../nav/NavBar';
import FluxNotesEditor from '../notes/FluxNotesEditor';
import DataSummaryPanel from '../summary/DataSummaryPanel';
import FormTray from '../forms/FormTray';
import TimelinePanel from '../timeline/TimelinePanel';
// Shortcuts
import ShortcutManager from '../shortcuts/ShortcutManager';
// Data model
import Patient from '../patient/Patient';
import SummaryMetadata from '../summary/SummaryMetadata';
// Lodash component
import Lang from 'lodash'

import './FullApp.css';

class FullApp extends Component {
    constructor(props) {
        super(props);

		this.getItemListForProcedures = this.getItemListForProcedures.bind(this);
		this.summaryMetadata = new SummaryMetadata();
		this.shortcutManager = new ShortcutManager(this.shortcuts);

	    this.state = {
            SummaryItemToInsert: '',
            withinStructuredField: null,
            selectedText: null,
            // Current shortcutting: 
            currentShortcut: null,
			currentConditionEntry: null,
			summaryMetadata: this.summaryMetadata.getMetadata(),
            patient: new Patient()
        };
    }
	
	shortcuts = [ "progression", "staging", "toxicity" ];
	inserters =	[	{trigger: "age", value: (patient) => { return patient.getAge(); }},
					{trigger: "name", value: (patient) => { return patient.getName(); }},
					{trigger: "gender", value: (patient) => { return patient.getGender(); }},
					{trigger: "dateofbirth", value: (patient) => { return patient.getDateOfBirth().format("D.MMM.YYYY"); }},
					{trigger: "patient", value: (patient) => { return patient.getName() + " is a " + patient.getAge() + " year old " + patient.getGender(); }}
				];
	
	getItemListForProcedures = (patient, currentConditionEntry) => {
		let procedures = patient.getProceduresForConditionChronologicalOrder(currentConditionEntry);
		return procedures.map((p, i) => {
			if (Lang.isObject(p.occurrenceTime)) {
				return {name: p.specificType.coding.displayText, value: p.occurrenceTime.timePeriodStart + " to " + p.occurrenceTime.timePeriodEnd};
			} else {
				return {name: p.specificType.coding.displayText, value: p.occurrenceTime };
			}
		});
	}

    /* 
     * Change the current shortcut to be the new type of shortcut  
     */
    newCurrentShortcut = (shortcutType, obj) => {
		let newShortcut = null;
        if (!Lang.isNull(shortcutType)) {
			newShortcut = this.shortcutManager.createShortcut(shortcutType, this.handleShortcutUpdate, obj);
        }
        this.setState({currentShortcut: newShortcut});
		return newShortcut;
    }
	
	changeCurrentShortcut = (shortcut) => {
		this.setState({currentShortcut: shortcut});
	}

    handleShortcutUpdate = (s) =>{
        console.log(`Updated shortcut`);
		let p = this.state.patient;
		s.updatePatient(p);
        this.setState({currentShortcut: s, patient: p});
    }

    handleStructuredFieldEntered = (field) => {
        console.log("structured field entered: " + field);
        this.setState({
            withinStructuredField: field
        })
    }

    handleStructuredFieldExited = (field) => {
        console.log("structured field exited: " + field);
        this.setState({
            withinStructuredField: null
        })
    }
    
    handleSelectionChange = (selectedText) => {
        //console.log("FullApp. selectedText: " + selectedText);
        this.setState({
            selectedText: selectedText
        })
    }

    handleSummaryItemSelected = (itemText) =>{
        if (itemText) {
            this.setState({SummaryItemToInsert: itemText});
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div className="FullApp">
                    <NavBar title="Flux Notes"/>
                    <Grid className="FullApp-content" fluid>
                        <Row center="xs">
                            <Col sm={4}>
                                <DataSummaryPanel
                                    // Handle updates
                                    onItemClicked={this.handleSummaryItemSelected}
                                    // Properties
                                    allowItemClick={this.state.currentShortcut == null}
									summaryMetadata={this.state.summaryMetadata}
                                    patient={this.state.patient}
                                />
                            </Col>
                            <Col sm={5}>
                                <FluxNotesEditor
                                    // Update functions
                                    onSelectionChange={this.handleSelectionChange}
                                    changeCurrentShortcut={this.changeCurrentShortcut}
									newCurrentShortcut={this.newCurrentShortcut}
                                    // Properties
                                    currentShortcut={this.state.currentShortcut}
                                    itemToBeInserted={this.state.SummaryItemToInsert}
                                    patient={this.state.patient}
									shortcutList={this.shortcuts}
									inserters={this.inserters}
                                />
                            </Col>
                            <Col sm={3}>
                                <FormTray
                                    // Update functions
                                    changeShortcut={this.changeCurrentShortcut}
                                    // Properties
                                    currentShortcut={this.state.currentShortcut}
                                    patient={this.state.patient}
                                    selectedText={this.state.selectedText}
                                    withinStructuredField={this.state.withinStructuredField}
                                />
                            </Col>
                        </Row>
                        <Row center="xs">
                            <Col sm={12}>
                                <TimelinePanel
                                    patient={this.state.patient}
                                />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default FullApp;
