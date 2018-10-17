import styled from 'styled-components';

const DiscreteTable = styled.table`
  color: #333;
  font-family: Helvetica, Arial, sans-serif;
  width: 640px;

  td,
  th {
    border: 1 solid black !important;
    height: 30px;
    text-align: center;
    padding: 10px;
  }

  th {
    background: linear-gradient(#333 0%, #444 100%);
    color: #fff;
    font-weight: bold;
    height: 40px;
  }

  td {
    background: #fafafa;
    text-align: center;
    margin: 5px;
    position: relative;
  }

  tr:nth-child(even) td {
    background: #eee;
  }
  tr:nth-child(odd) td {
    background: #fdfdfd;
  }

  tr td:first-child,
  tr th:first-child {
    background: none;
    font-style: italic;
    font-weight: bold;
    font-size: 14px;
    text-align: right;
    padding-right: 10px;
    width: 80px;
  }

  tr:first-child th:nth-child(2) {
    border-radius: 5px 0 0 0;
  }

  tr:first-child th:last-child {
    border-radius: 0 5px 0 0;
  }

  .delete_td_popup {
    display: inline-block;
    width: 20px;
    position: absolute;
    left: 50px;
    top: -5px;
    height: 20px;
    z-index: 1000;
    // border: 1px solid black;
    cursor: pointer;

    &:after,
    &:before {
      transition: opacity 0.2s;
      content: '';
      display: block;
      position: absolute;
      top: 10px;
      width: 20px;
      height: 5px;
      opacity: 0;
      border-radius: 3px;
      transform: rotate(45deg);
      background: red;
    }

    &:before {
      transform: rotate(-45deg);
    }
  }

  td:hover {
    .delete_td_popup {
      &:after,
      &:before {
        opacity: 1;
      }
    }

    .pin {
      opacity: 1;
    }
  }
`;

const DeleteTdPopup = styled.span`
  display: none;
`;

const Pin = styled.span`
  cursor: pointer;
  z-index: 1;
  opacity: ${props => props.pinned ? 1 : 0};
  position: absolute;
  width: 20px;
  height: 20px
  top: 0;
  left: 0;
  svg {
    transition: transform .2s;
    transform: ${props => props.pinned ? 'rotate(-30deg)' : 'rotate(0deg)'};
    width: 15px;
  }
`;

const UploadButtons = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-between;
  margin: 10px;

  .icon {
    position: relative;
    top: 5px;
    width: 26px;
    height: 26px;
    color: white;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const XYChooser = styled.div`
  display: flex;
  width: 650px;
  justify-content: space-around;
  align-items: center;
  margin: 10px;
`;

const FileInput = styled.input`
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  opacity: 0;
`;

export {
  DiscreteTable,
  DeleteTdPopup,
  UploadButtons,
  FormContainer,
  XYChooser,
  FileInput,
  Pin
};
