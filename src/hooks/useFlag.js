import { useGateValue } from '@statsig/react-bindings'

const useFlag = (flag) => {
  return useGateValue(flag)
}

export default useFlag
