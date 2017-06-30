/* eslint "react/prop-types": "warn" */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import MetricSidebar from './MetricSidebar.jsx';
import SidebarLayout from 'metabase/components/SidebarLayout.jsx';
import MetricQuestions from "metabase/reference/metrics/MetricQuestions.jsx"

import * as metadataActions from 'metabase/redux/metadata';
import * as actions from 'metabase/reference/reference';

import {
    getUser,
    getMetric,
    getMetricId,
    getDatabaseId,
    getIsEditing
} from '../selectors';

import {
    loadEntities
} from 'metabase/questions/questions';

const mapStateToProps = (state, props) => ({
    user: getUser(state, props),
    metric: getMetric(state, props),
    metricId: getMetricId(state, props),
    databaseId: getDatabaseId(state, props),
    isEditing: getIsEditing(state, props)
});

const mapDispatchToProps = {
    fetchQuestions: () => loadEntities("cards", {}),
    ...metadataActions,
    ...actions
};

@connect(mapStateToProps, mapDispatchToProps)
export default class MetricQuestionsContainer extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        metric: PropTypes.object.isRequired,
        isEditing: PropTypes.bool
    };

    async fetchContainerData(){
        await actions.rFetchMetricQuestions(this.props, this.props.metricId);
    }

    async componentWillMount() {
        this.fetchContainerData()
    }

    async componentWillReceiveProps(newProps) {
        if (this.props.location.pathname === newProps.location.pathname) {
            return;
        }

        newProps.endEditing();
        newProps.endLoading();
        newProps.clearError();
        newProps.collapseFormula();
    }

    render() {
        const {
            user,
            metric,
            isEditing
        } = this.props;

        return (
            <SidebarLayout
                className="flex-full relative"
                style={ isEditing ? { paddingTop: '43px' } : {}}
                sidebar={<MetricSidebar metric={metric} user={user}/>}
            >
                <MetricQuestions {...this.props} />
            </SidebarLayout>
        );
    }
}
