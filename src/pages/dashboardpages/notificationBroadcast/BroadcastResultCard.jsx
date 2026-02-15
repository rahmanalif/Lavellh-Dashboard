import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Item = ({ label, value }) => (
  <div className="flex items-center justify-between border-b py-2 last:border-b-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const BroadcastResultCard = ({ result }) => {
  if (!result) return null;
  const push = result?.push || {};
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Last Broadcast Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <Item label="Targeted users" value={result.targetedUsers ?? 0} />
        <Item
          label="Notifications created"
          value={result.notificationsCreated ?? 0}
        />
        <Item label="Push attempted" value={push.attempted ? "Yes" : "No"} />
        <Item label="Push sent" value={push.sent ?? 0} />
        <Item label="Push failed" value={push.failed ?? 0} />
        <Item label="Push tokens" value={push.tokens ?? 0} />
      </CardContent>
    </Card>
  );
};

export default BroadcastResultCard;
