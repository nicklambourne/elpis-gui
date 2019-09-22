import React, { Component } from 'react';
import { Button, Grid, Header, Segment, Table } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { modelList, modelLoad, datasetLoad, pronDictLoad } from 'redux/actions';
import arraySort from 'array-sort'
import Branding from 'components/Steps/Shared/Branding';
import Informer from 'components/Steps/Shared/Informer';
import NewForm from 'components/Steps/Model/NewForm';
import CurrentModelName from "./CurrentModelName";
import urls from 'urls';

class ModelDashboard extends Component {

    state = {
        column: null,
        reverse: false
    }

    componentDidMount() {
        this.props.modelList()
    }

    handleSort = (clickedColumn, data) => () => {
        const { column } = this.state
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                reverse: false,
            })
            arraySort(data, clickedColumn, { reverse: false })
        } else {
            this.setState({
                reverse: ! this.state.reverse
            })
            arraySort(data, clickedColumn, { reverse: ! this.state.reverse })
        }
    }

    handleLoad = values => {
        const { modelLoad } = this.props
        const modelData = { name: values.name }
        const datasetData = { name: values.dataset_name }
        const pronDictData = { name: values.pron_dict_name }
        modelLoad(modelData, datasetData, pronDictData)
    }

    render() {
        const { t, name, list } = this.props
        const { column, direction } = this.state
        const listEl = list.length > 0 ? (
            <Table sortable celled fixed unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            sorted={ column === 'name' ? direction : null }
                            onClick={ this.handleSort('name', list) }
                        >
                            Name
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={ column === 'dataset_name' ? direction : null }
                            onClick={ this.handleSort('dataset_name', list) }
                        >
                            Recordings
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={ column === 'pron_dict_name' ? direction : null }
                            onClick={this.handleSort('pron_dict_name', list) }
                        >
                            Pronunciation Dictionaries
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        list.map(model => {
                            const className = (name === model.name) ? 'current' : ''
                            return (
                                <Table.Row key={ model.name } className={ className }>
                                    <Table.Cell>
                                        <Button
                                            className={className}
                                            fluid
                                            onClick={ () => this.handleLoad(model) }
                                            >{ model.name }</Button>
                                    </Table.Cell>
                                    <Table.Cell>{ model.dataset_name }</Table.Cell>
                                    <Table.Cell>{ model.pron_dict_name }</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        ) : <p>{ t('model.dashboard.noneMessage') }</p>

        return (
            <div>
                <Branding />
                <Segment>
                    <Grid centered>
                        <Grid.Column width={ 4 }>
                            <Informer />
                        </Grid.Column>

                        <Grid.Column width={ 12 }>

                            <Header as='h1'>
                                { t('model.dashboard.title') }
                            </Header>

                            <CurrentModelName />


                            {list.length == 0 &&
                                <NewForm />
                            }

                            {list.length > 0 &&
                                <>
                                    <Segment>
                                        <Button
                                            className='add'
                                            content={t('common.newButton')}
                                            labelPosition='left'
                                            icon='add'
                                            as={Link}
                                            to={urls.gui.model.new} />
                                    </Segment>
                                    <Segment>
                                        {listEl}
                                    </Segment>
                                </>
                            }

                        </Grid.Column>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        name: state.model.name,
        list: state.model.modelList
    }
}

const mapDispatchToProps = dispatch => ({
    modelList: () => {
        dispatch(modelList())
    },
    modelLoad: (modelData, datasetData, pronDictData) => {
        // TODO asynch these?
        dispatch(modelLoad(modelData))
        dispatch(datasetLoad(datasetData))
        dispatch(pronDictLoad(pronDictData))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(ModelDashboard))
