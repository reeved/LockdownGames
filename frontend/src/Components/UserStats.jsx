import { useContext, React } from 'react';
import SimpleTabs from './SimpleTabs';
import { MongoContext } from '../Context';

export default function UserStats() {
  const { state: mongoState } = useContext(MongoContext);
  return (
    <>
      <SimpleTabs pokerStats={mongoState.pokerStats} codenameStats={mongoState.codenameStats} lastCardStats={mongoState.lastCardStats} />
    </>
  );
}
