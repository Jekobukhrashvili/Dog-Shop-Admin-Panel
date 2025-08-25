import styled from "styled-components";

export const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  padding: 15px;
  border: 2px solid #61dafb;
  border-radius: 12px;
  background: #f9f9f9;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex: 1;
`;

export const Button = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #61dafb;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #21a1f1;
  }
`;

export const AnimalCard = styled.li`
  list-style: none;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;
