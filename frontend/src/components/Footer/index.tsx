import * as React from 'react';
import {Box} from '~css/Layout';
import styled from 'styled-components';

export interface FooterProps {
}

export default function Footer (props: FooterProps) {
  return (
    <StyledFooter>
         Copyright © Team Mbs All Rights Reserved.
    </StyledFooter>
  );
}

const StyledFooter = styled.div`
    grid-area: footer;
    border-top: solid 1px gray;
    text-align: center;
    padding: 5rem 0 5rem 0;
    margin: 5rem 10rem 0 10rem;
`;