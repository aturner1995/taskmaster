import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { QUERY_REVERSE_GEOCODE } from '../utils/queries';
import { Button } from 'primereact/button';
import { useParams } from 'react-router-dom';

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [userAddress, setUserAddress] = useState('');

  let { query } = useParams();
  useEffect(() => {
    setSearchQuery(query)
  }, [query]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const { loading, error, data } = useQuery(QUERY_REVERSE_GEOCODE, {
    variables: { latitude, longitude },
  });

  useEffect(() => {
    if (data) {
      if (data.reverseGeocode) {
        setCity(data.reverseGeocode.city);
        setState(data.reverseGeocode.state);
        setCountry(data.reverseGeocode.country);
        setUserAddress(
          `${data.reverseGeocode.city}, ${data.reverseGeocode.state}, ${data.reverseGeocode.country}`
        );
      }
    }
  }, [data]);

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserAddressChange = (e) => {
    setUserAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery('');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mx-5">
        <Row className="m-2">
          <Col xs={12} md={5} className="mb-2 mb-md-0 mx-2">
            <Form.Control
              value={searchQuery || ''}
              type="string"
              placeholder="Search for your task"
              onChange={handleSearchQueryChange}
              className='mt-1'
            />
          </Col>
          <Col xs={12} md={5} className='mx-2'>
            <Form.Control
              value={userAddress}
              type="string"
              placeholder="Address"
              onChange={handleUserAddressChange}
              className='mt-1'
            />
          </Col>
          <Col>
            <Button type="submit" severity="success" className="mb-2" size="small">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default SearchForm;