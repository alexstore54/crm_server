import { AgentUtil } from './agent.util';
import { getMockedAgent, getMockedAgentForClient } from '@/shared/mocks/agent/agent.mock';

describe(AgentUtil, () => {
  describe(AgentUtil.mapAgentToAgentForClient.name, () => {
    it('should remove the password field from the agent object', () => {
      const result = AgentUtil.mapAgentToAgentForClient(getMockedAgent());
      expect(result).toEqual({
        ...getMockedAgentForClient(),
        lastOnline: expect.any(Date),
      });
    });
  });
});