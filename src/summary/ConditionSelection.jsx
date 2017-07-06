import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';

import './ConditionSelection.css';

class ConditionSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeCondition: 0
    };

    this.previousCondition = this.previousCondition.bind(this);
    this.nextCondition = this.nextCondition.bind(this);
  }

  render() {

    const activeCondition = this.props.conditions[this.state.activeCondition];

    let leftArrowClass = "arrow";
    if (this.state.activeCondition === 0) {
      leftArrowClass += " disabled";
    }

    let rightArrowClass = "arrow";
    if (this.state.activeCondition === this.props.conditions.length - 1) {
      rightArrowClass += " disabled";
    }

    return (
      <div>
        <Divider className="divider" />
          <div className="selected-condition">
              <span className="title">{activeCondition.name}</span>
              <span id="left-arrow" className={leftArrowClass} style={{cursor:'pointer'}}>
                  <a onClick={(e) => this.previousCondition(e)}><i className="fa fa-arrow-left"></i></a>
              </span>
              <span id="right-arrow" className={rightArrowClass} style={{cursor:'pointer'}}>
                  <a onClick={(e) => this.nextCondition(e)}><i className="fa fa-arrow-right"></i></a>
              </span>
          </div>
        <Divider className="divider" />
      </div>
    );
  }

  previousCondition(e) {
    if (this.state.activeCondition > 0) {
      this.setState({activeCondition: this.state.activeCondition - 1});
    }
  }

  nextCondition(e) {
    if (this.state.activeCondition < this.props.conditions.length - 1) {
      this.setState({activeCondition: this.state.activeCondition + 1});
    }
  }
}

ConditionSelection.propTypes = {
  conditions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    codes: PropTypes.arrayOf(PropTypes.shape({
      system: PropTypes.string,
      code: PropTypes.string,
      display: PropTypes.string
    }))
  }))
};

export default ConditionSelection;
