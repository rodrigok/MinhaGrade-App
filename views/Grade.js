import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Text, StyleSheet, ScrollView, View } from 'react-native';

import {
	List
} from 'antd-mobile-rn';

const styles = StyleSheet.create({
	badge: {
		backgroundColor: '#EEE',
		borderRadius: 5,
		overflow: 'hidden',
		paddingHorizontal: 3,
		paddingVertical: 1,
		marginRight: 8
	}
});

class Divider extends React.Component {
	render() {
		return (
			<View key='title' >
				<View style={{ height: 1, backgroundColor: '#eee', marginTop: 10 }}></View>
				<Text style={{ fontSize: 12, color: '#888', marginBottom: 8, textAlign: 'left', marginTop: -9 }}>
					<Text style={{ fontWeight: 'bold', backgroundColor: 'white', marginVertical: 5 }}>{this.props.children}  </Text>
				</Text>
			</View>
		);
	}
}

class Grade extends React.Component {
	state = {}

	renderRequirements(grade) {
		if (!grade.requirement || !grade.requirement.length) {
			return;
		}

		const items = [
			<Divider key='title'>Requisitos</Divider>
		].concat(grade.requirement.map(requirement => {
			return (
				<View key={requirement._id} style={{ backgroundColor: 'red', paddingVertical: 1, paddingHorizontal: 5, borderRadius: 2, marginBottom: 2 }}>
					<Text style={{ fontSize: 12, color: '#FFF', fontWeight: 'bold' }}>
						<Text>{requirement.code}</Text>
						<Text> - </Text>
						<Text>{requirement.name}</Text>
					</Text>
				</View>
			);
		}));

		return items;
	}

	renderDetail(open, grade) {
		if (!open) {
			return <View />;
		}

		return (
			<React.Fragment>
				<Text style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
					<Text>
						<Text style={{ fontWeight: 'bold' }}>Código: </Text>
						<Text>{grade.code}</Text>
						<Text>  ·  </Text>
						<Text style={{ fontWeight: 'bold' }}>Créditos: </Text>
						<Text>{grade.credit}</Text>
						<Text>  ·  </Text>
						<Text style={{ fontWeight: 'bold' }}>Carga Horária: </Text>
						<Text>{grade.workload}</Text>
					</Text>
				</Text>
				{this.renderRequirements(grade)}
				<Divider key='title'>Ementa</Divider>
				<View style={{ borderRadius: 5, backgroundColor: '#F5F5F9', marginTop: 0 }}>
					<Text style={{ fontSize: 12, padding: 10, color: '#888' }}>
						{grade.description}
					</Text>
				</View>
			</React.Fragment>
		);
	}

	renderItems() {
		const { data: { grades } } = this.props;

		return grades.map((grade) => {
			const odd = grade.semester % 2 !== 0;
			const open = this.state.open === grade._id;

			return (
				<List.Item key={grade._id} arrow={open ? 'up' : 'down'} multipleLine onClick={() => this.setState({ open: open ? undefined : grade._id })}>
					<View style={{ flexDirection: 'row', paddingVertical: 8 }}>
						<View style={[styles.badge, { backgroundColor: odd ? '#EEE' : '#AAA' }]}>
							<Text style={{ color: odd ? '#888' : '#FFF' }}>{`${ grade.semester }º`}</Text>
						</View>
						<Text>
							{grade.name}
						</Text>
					</View>
					{this.renderDetail(open, grade)}
				</List.Item>
			);
		});
	}

	render() {
		const { data: { loading, error } } = this.props;
		if (error) {
			return alert(error);
		}

		if (loading) {
			return <Text>Loading</Text>;
		}

		return (
			<ScrollView>
				<List renderHeader={() => 'Subtitle'} className='my-list'>
					{this.renderItems()}
				</List>
			</ScrollView>
		);
	}
}

export default graphql(gql`
	query {
		courses {
			name
		}
		grades (course: "SI") {
			_id
			credit
			workload
			code
			name
			semester
			description
			requirement {
				_id
				semester
				code
				name
			}
		}
	}
`)(Grade);