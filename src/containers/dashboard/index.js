import React from 'react';

import { accountService } from '@/_services';
import { Grid, Segment, Container } from 'semantic-ui-react';
import './dashboard.css';

function Dashboard() {
	//const user = accountService.userValue;

	return (
		<Container fluid style={{ height: '100%' }}>
			<Grid className="Dashboard page-grid">
				<Grid.Row stretched>
					<Grid.Column width={4}>
						<Segment>
							<p>Active User</p>
						</Segment>
					</Grid.Column>
					<Grid.Column width={4}>
						<Segment>
							<p>Statistics of User(number of current month users vs next month users)</p>
						</Segment>
					</Grid.Column>
					<Grid.Column width={8}>
						<Segment>
							<p>Number of paid user and remaning non paid users</p>
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row stretched>
					<Grid.Column width={4}>
						<Segment>
							<p>Profit of Current Month</p>
						</Segment>
					</Grid.Column>
					<Grid.Column width={4}>
						<Segment>
							<p>Statistics of profit per Month</p>
						</Segment>
					</Grid.Column>
					<Grid.Column width={8}>
						<Segment>
							<p>Statistics of users per region</p>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	);
}

export { Dashboard };
