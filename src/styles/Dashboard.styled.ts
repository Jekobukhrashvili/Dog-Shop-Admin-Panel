import styled from "styled-components";

export const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
`;
export const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columnssepeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;
export const StatCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  h3 {
    margin-bottom: 10px;
    color: #61dafb;
  }
  p {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;
