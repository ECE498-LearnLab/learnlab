// @ts-nocheck
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { Table, Column, Button, Badge } from 'react-rainbow-components';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const RoomListContainer = styled.div.attrs(props => props.theme.rainbow)`
  padding: 8px 16px;
  color: ${props => props.palette.text.title};
`;

const Title = styled.h1.attrs(props => props.theme.rainbow)`
    font-family: 'Lato Light';
    font-size: 25px;
    text-align: left;
    margin-bottom: 4px;
    color: ${props => props.palette.text.main};
`;

const Subtitle = styled.h3.attrs(props => props.theme.rainbow)`
    font-family: Lato;
    font-size: 14px;
    margin-bottom: 2px;
    color: ${props => props.palette.text.title};
`;

const IconContainer = styled.div.attrs(props => props.theme.rainbow)`
  margin-left: 4px
`;

const badgeStyles = {marginLeft: '0.5rem' };
const StatusBadge = ({ value }) => <Badge label={value} variant={value === "ongoing" ? "success" : "default"} style={badgeStyles} />;

// to-do get this from graphql 
const data = [
  {name: 'Lesson: Intro to Cells',
  status: 'ongoing',
  date: 'Dec 21 2020',
  start_time: '11:30 AM',
  end_time: '1:00 PM'},
  {name: 'Homework Help',
  status: 'scheduled',
  date: 'Dec 22 2020',
  start_time: '3:30 PM',
  end_time: '4:00 PM'},
  {name: 'Lesson: Cells Part 1',
  status: 'scheduled',
  date: 'Dec 29 2020',
  start_time: '1:30 PM',
  end_time: '2:00 PM'}
];

// to-do type these props, idk what data is coming yet
function JoinRoomButton(props) {
    const { row, onJoinRoom } = props;

    return (
    <Button variant="brand"  onClick={(event) => onJoinRoom(event, row.id)}
        className="rainbow-m-around_medium">
        Join Room
        <IconContainer>
          <ArrowForwardIcon />
        </IconContainer>
    </Button>
    );
}

function RoomList(props: {onJoinRoom: (event: FormEvent<HTMLFormElement>, roomID : string) => void}) {
  const {onJoinRoom} = props;
    return (
        <RoomListContainer>
            <div>
                <Title>Rooms</Title>
                <Subtitle>Total • {data.length}</Subtitle>
            </div>
            <Table
              data={data}
              keyField="id"
            >
              <Column header={"name"} field={"name"} />
              <Column header={"status"} field={"status"} component={StatusBadge} />
              <Column header={"date"} field={"date"} />
              <Column header={"start time"} field={"start_time"} />
              <Column header={"end time"} field={"end_time"} />
              <Column
                width={190}
                // @ts-ignore
                component={({ row }) => (
                    <JoinRoomButton row={row} onJoinRoom={onJoinRoom} />
                )}/>;
            </Table>
        </RoomListContainer>
    );
}

export default RoomList;