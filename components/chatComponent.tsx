import MessageBox from "./messageBox";
import { Badge } from "./ui/badge";
import { useChat } from "ai/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2 } from "lucide-react";

type Props = { reportData: string };

function ChatComponent({ reportData }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/legalchatgemini",
    });

  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      <Badge
        variant={"outline"}
        className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
      >
        {reportData ? "Report Added" : "No Report Added"}
      </Badge>

      <div className="flex-1"></div>
      <div className="flex flex-col gap-4">
        {messages.map((m, idx) => {
          return <MessageBox key={idx} role={m.role} content={m.content} />;
        })}
      </div>
      <form 
       className="relative overflow-hidden rounded-lg border bg-background"
       onSubmit = {(e) => {
         e.preventDefault();
         handleSubmit(e, {
            data: {
               reportData: reportData
            }
         })
       }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="min-h-22 resize-none border-0 p-3 pr-10 shadow-none focus-visible:ring-0"
        />

        <Button
          disabled={isLoading}
          type="submit"
          size="sm"
          className="absolute bottom-2 right-2"
        >
          {isLoading ? "Analyzing..." : "3. Ask"}
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CornerDownLeft className="size-3.5" />
          )}
        </Button>
      </form>
    </div>
  );
}

export default ChatComponent;
