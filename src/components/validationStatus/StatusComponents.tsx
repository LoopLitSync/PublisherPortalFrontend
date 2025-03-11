import Pending from "./Pending";
import Rejected from "./Rejected";
import Approved from "./Approved";
import NeedsRevision from "./NeedsRevision";

const statusComponents: Record<string, React.ElementType> = {
    PENDING: Pending,
    REJECTED: Rejected,
    APPROVED: Approved,
    NEEDS_REVISION: NeedsRevision,
};

export default statusComponents;
