import { Button } from "@/components/ui/button";

type NewApplicationTriggerProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export function NewApplicationTrigger({
  disabled = false,
  onClick,
}: NewApplicationTriggerProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      New application
    </Button>
  );
}
