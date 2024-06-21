import { Form } from 'react-router-dom';

const ProposalVotingForm = ({ id }: { id: `0x${string}` }) => {
  return (
    <Form>
      <div>
        <p>{id}</p>
      </div>
    </Form>
  );
};

export default ProposalVotingForm;
